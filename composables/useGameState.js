import { ref, watch } from 'vue'
import { levels } from './gameLevels'
import { useObstaclePatterns } from './useObstaclePatterns'

export function useGameState() {
  const playerPosition = ref({ x: 10, y: 10 })
  const collectibles = ref([])
  const obstacles = ref([])
  const score = ref(0)
  const currentLevel = ref(1)
  const isTransitioning = ref(false)
  const gridSize = 20
  const tileSize = 30
  const collectedItems = ref(new Set())
  const { currentStep, isAnimating, generateObstacles, startAnimation, stopAnimation } = useObstaclePatterns()
  const isVictorious = ref(false)

  const loadLevel = (levelNumber) => {
    const level = levels[levelNumber]
    if (!level) return false

    collectibles.value = level.collectibles
      .map(([x, y]) => ({ x, y }))
      .filter(item => !collectedItems.value.has(`${levelNumber}-${item.x}-${item.y}`))

    // Stop previous animation and start new one
    stopAnimation()
    
    // Handle both single and multiple obstacles
    if (Array.isArray(level.obstacles)) {
      startAnimation(level.obstacles[0]) // Start animation with first pattern's settings
      obstacles.value = level.obstacles.flatMap(pattern => 
        generateObstacles(pattern, currentStep.value)
      )
    } else {
      startAnimation(level.obstacles)
      obstacles.value = generateObstacles(level.obstacles, currentStep.value)
    }

    // Set spawn point
    if (levelNumber === 1) {
      playerPosition.value = { ...level.spawnPoint }
    } else {
      // Spawn next to the up/down point we came from
      const prevLevel = levels[levelNumber - 1]
      if (prevLevel?.up) {
        playerPosition.value = { x: level.down.x + 1, y: level.down.y }
      } else {
        playerPosition.value = { x: level.up.x - 1, y: level.up.y }
      }
    }
    
    return true
  }

  const checkPortals = () => {
    const level = levels[currentLevel.value]
    
    if (level.up && 
        playerPosition.value.x === level.up.x && 
        playerPosition.value.y === level.up.y) {
      // Check if this is the final level
      if (currentLevel.value === 10) {
        isVictorious.value = true
        return true
      }
      
      isTransitioning.value = true
      currentLevel.value++
      loadLevel(currentLevel.value)
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
      return true
    }
    
    if (level.down && 
        playerPosition.value.x === level.down.x && 
        playerPosition.value.y === level.down.y) {
      isTransitioning.value = true
      // Change level immediately
      currentLevel.value--
      loadLevel(currentLevel.value)
      // Keep transition state for flashing animation
      setTimeout(() => {
        isTransitioning.value = false
      }, 600) // Match the duration of flashing animation
      return true
    }
    
    return false
  }

  const initializeGame = () => {
    currentLevel.value = 1
    score.value = 0
    collectedItems.value = new Set()
    loadLevel(1)
  }

  const checkCollisions = () => {
    // Check collectibles
    const collectibleIndex = collectibles.value.findIndex(
      c => c.x === playerPosition.value.x && c.y === playerPosition.value.y
    )
    if (collectibleIndex !== -1) {
      const collectible = collectibles.value[collectibleIndex]
      collectedItems.value.add(`${currentLevel.value}-${collectible.x}-${collectible.y}`)
      collectibles.value.splice(collectibleIndex, 1)
      score.value += 10
    }

    // Check obstacles
    const hitObstacle = obstacles.value.some(
      o => o.x === playerPosition.value.x && o.y === playerPosition.value.y
    )
    if (hitObstacle) {
      loadLevel(currentLevel.value) // Reset to level spawn point
      score.value = Math.max(0, score.value - 5)
    }

    // Check finish tile in level 10
    const level = levels[currentLevel.value]
    if (level.finish && 
        playerPosition.value.x === level.finish.x && 
        playerPosition.value.y === level.finish.y) {
      isVictorious.value = true
      return true
    }

    // Check for level transitions
    return checkPortals() // Return whether a level change occurred
  }

  // Update obstacles position on animation step
  watch(currentStep, (step) => {
    if (isAnimating.value) {
      const level = levels[currentLevel.value]
      if (Array.isArray(level.obstacles)) {
        obstacles.value = level.obstacles.flatMap(pattern => 
          generateObstacles(pattern, step)
        )
      } else {
        obstacles.value = generateObstacles(level.obstacles, step)
      }
    }
  })

  return {
    playerPosition,
    collectibles,
    obstacles,
    score,
    currentLevel,
    isTransitioning,
    gridSize,
    tileSize,
    initializeGame,
    checkCollisions,
    collectedItems,
    loadLevel,
    isVictorious,
  }
} 