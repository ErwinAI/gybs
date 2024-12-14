import { ref, watch, computed } from 'vue'
import { levels } from './gameLevels'
import { useObstaclePatterns } from './useObstaclePatterns'

export function useGameState(keyStates) {
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
  const collectibleMap = ref(new Map())
  const lastPortalPosition = ref(null)

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
    } else if (level.obstacles) { // Check if obstacles exist
      startAnimation(level.obstacles)
      obstacles.value = generateObstacles(level.obstacles, currentStep.value)
    } else {
      obstacles.value = [] // Set empty array if no obstacles
    }

    // Use lastPortalPosition if it exists, otherwise use spawnPoint
    if (lastPortalPosition.value) {
      playerPosition.value = { ...lastPortalPosition.value }
      // Don't clear lastPortalPosition here, let checkPortals handle it
    } else if (level.spawnPoint) {
      playerPosition.value = { ...level.spawnPoint }
    } else {
      playerPosition.value = { x: 1, y: 1 }
    }
    
    // Create fast lookup map for collectibles
    collectibleMap.value.clear()
    collectibles.value.forEach(c => {
      collectibleMap.value.set(`${c.x},${c.y}`, c)
    })
    
    return true
  }

  const checkPortals = () => {
    const level = levels[currentLevel.value]
    
    // Check multiple up portals
    if (Array.isArray(level.up)) {
      for (const portal of level.up) {
        if (playerPosition.value.x === portal.x && playerPosition.value.y === portal.y) {
          if (lastPortalPosition.value) {
            lastPortalPosition.value = null
            return false
          }
          isTransitioning.value = true
          currentLevel.value++
          loadLevel(currentLevel.value)
          setTimeout(() => {
            isTransitioning.value = false
          }, 600)
          return true
        }
      }
    } else if (level.up && 
        playerPosition.value.x === level.up.x && 
        playerPosition.value.y === level.up.y) {
      if (lastPortalPosition.value) {
        lastPortalPosition.value = null
        return false
      }
      if (currentLevel.value === 12) {
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
    
    // Check multiple down portals
    if (Array.isArray(level.down)) {
      for (const portal of level.down) {
        if (playerPosition.value.x === portal.x && playerPosition.value.y === portal.y) {
          isTransitioning.value = true
          lastPortalPosition.value = { x: portal.x, y: portal.y }
          const nextLevel = currentLevel.value - 1
          currentLevel.value = nextLevel
          loadLevel(nextLevel)
          setTimeout(() => {
            isTransitioning.value = false
          }, 600)
          return true
        }
      }
    } else if (level.down && 
        playerPosition.value.x === level.down.x && 
        playerPosition.value.y === level.down.y) {
      isTransitioning.value = true
      lastPortalPosition.value = { x: level.down.x, y: level.down.y }
      const nextLevel = currentLevel.value - 1
      currentLevel.value = nextLevel
      loadLevel(nextLevel)
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
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
    // First check portals
    const portalResult = checkPortals()
    if (portalResult) return true

    const pos = `${playerPosition.value.x},${playerPosition.value.y}`
    
    // Then check collectibles
    if (collectibleMap.value.has(pos)) {
      const collectible = collectibleMap.value.get(pos)
      collectedItems.value.add(`${currentLevel.value}-${collectible.x}-${collectible.y}`)
      collectibleMap.value.delete(pos)
      collectibles.value = collectibles.value.filter(c => 
        `${c.x},${c.y}` !== pos
      )
      score.value += 10
    }

    // Finally check obstacles
    const obstacleSet = new Set(
      obstacles.value.map(o => `${o.x},${o.y}`)
    )
    
    if (obstacleSet.has(pos)) {
      loadLevel(currentLevel.value)
      score.value = Math.max(0, score.value - 5)
      return true
    }

    return false
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

  const isWallTile = (x, y) => {
    // Check outer walls
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      return true
    }
    
    // Check level-specific walls
    const level = levels[currentLevel.value]
    if (level.walls) {
      return level.walls.some(([wallX, wallY]) => wallX === x && wallY === y)
    }
    
    return false
  }

  const movePlayer = () => {
    if (isTransitioning.value) return false

    const oldPosition = { ...playerPosition.value }
    let newPosition = { ...playerPosition.value }
    let moved = false

    // Handle each direction separately to allow sliding along walls
    if (keyStates.value.up) {
      const testPos = { ...newPosition, y: newPosition.y - 1 }
      if (!isWallTile(testPos.x, testPos.y)) {
        newPosition.y = testPos.y
        moved = true
      }
    }
    if (keyStates.value.down) {
      const testPos = { ...newPosition, y: newPosition.y + 1 }
      if (!isWallTile(testPos.x, testPos.y)) {
        newPosition.y = testPos.y
        moved = true
      }
    }
    if (keyStates.value.left) {
      const testPos = { ...newPosition, x: newPosition.x - 1 }
      if (!isWallTile(testPos.x, testPos.y)) {
        newPosition.x = testPos.x
        moved = true
      }
    }
    if (keyStates.value.right) {
      const testPos = { ...newPosition, x: newPosition.x + 1 }
      if (!isWallTile(testPos.x, testPos.y)) {
        newPosition.x = testPos.x
        moved = true
      }
    }

    if (moved) {
      playerPosition.value = newPosition
      // Check collisions only if we actually moved
      const levelChanged = checkCollisions()
      return true || levelChanged
    }

    return false
  }

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
    movePlayer,
  }
} 