import { ref, watch, computed } from 'vue'
import { levels } from './gameLevels'
import { useObstaclePatterns } from './useObstaclePatterns'
import { useEnemy } from './useEnemy'

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
  const collectibleMap = ref(new Map())
  const keyStates = ref({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  })
  const lastPortalPosition = ref(null)
  const enemies = ref([])
  const { 
    getWallHuggerNextPosition, 
    getPatrollerNextPosition, 
    getHunterNextPosition, 
    getStepHunterNextPosition
  } = useEnemy()
  let enemyUpdateInterval = null
  const playerStepCount = ref(0)

  const loadLevel = (levelNumber) => {
    playerStepCount.value = 0
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
      // TODO: This causes issues with secret level spawns - we should probably 
      // only use lastPortalPosition for regular levels, not secret ones
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
    
    // Handle enemies
    if (level.enemies) {
      enemies.value = level.enemies.map(enemy => {
        if (enemy.type === 'snake') {
          // Initialize snake with segments
          return {
            ...enemy,
            segments: Array(enemy.length - 1).fill(null).map((_, i) => ({
              x: enemy.x - (i + 1),  // Initial segments behind the head
              y: enemy.y
            }))
          }
        }
        return { ...enemy }
      })
      
      // Clear existing interval if any
      if (enemyUpdateInterval) {
        clearInterval(enemyUpdateInterval)
      }
      
      // Set up enemy movement interval
      enemyUpdateInterval = setInterval(() => {
        enemies.value = enemies.value.map(enemy => {
          // Only move if enough time has passed based on animationSpeed
          const now = Date.now()
          enemy.lastMoveTime = enemy.lastMoveTime || now
          
          if (now - enemy.lastMoveTime < enemy.animationSpeed) {
            return enemy
          }

          enemy.lastMoveTime = now

          switch (enemy.type) {
            case 'wallHugger':
              const nextWallPos = getWallHuggerNextPosition(enemy, level.walls || [], gridSize)
              return nextWallPos ? { ...enemy, ...nextWallPos } : enemy
            
            case 'patroller':
              const nextPatrolPos = getPatrollerNextPosition(enemy)
              return nextPatrolPos ? { ...enemy, ...nextPatrolPos } : enemy
            
            case 'hunter':
              const nextHuntPos = getHunterNextPosition(enemy, playerPosition.value)
              return nextHuntPos ? { ...enemy, ...nextHuntPos } : enemy
            
            default:
              return enemy
          }
        })
      }, 50) // We can use a shorter interval since we're checking time properly now
    } else {
      enemies.value = []
    }
    
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
          
          // If we're in a sub-level, return to parent level
          if (level.returnLevel) {
            currentLevel.value = level.returnLevel
          } else if (level.nextLevel === "victory") {
            isVictorious.value = true
            return true
          } else {
            currentLevel.value = level.nextLevel
          }
          
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
      isTransitioning.value = true
      
      // If we're in a sub-level, return to parent level
      if (level.returnLevel) {
        currentLevel.value = level.returnLevel
      } else if (level.nextLevel === "victory") {
        isVictorious.value = true
        return true
      } else {
        currentLevel.value = level.nextLevel
      }
      
      loadLevel(currentLevel.value)
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
      return true
    }
    
    // Check multiple down portals
    if (Array.isArray(level.down)) {
      for (const [index, portal] of level.down.entries()) {
        if (playerPosition.value.x === portal.x && playerPosition.value.y === portal.y) {
          isTransitioning.value = true
          lastPortalPosition.value = { x: portal.x, y: portal.y }
          
          // Use the corresponding hidden level (b, c, etc.)
          const hiddenLevels = level.hiddenLevels || []
          const targetLevel = hiddenLevels[index] || `${currentLevel.value}b`
          currentLevel.value = targetLevel
          
          loadLevel(targetLevel)
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
      
      // Use the specified hidden level or default to 'b'
      const targetLevel = level.hiddenLevel || `${currentLevel.value}b`
      currentLevel.value = targetLevel
      
      loadLevel(targetLevel)
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

    // Check enemy collisions
    const enemyCollision = enemies.value.some(enemy => {
      if (enemy.type === 'snake') {
        return (enemy.x === playerPosition.value.x && enemy.y === playerPosition.value.y) ||
               enemy.segments?.some(segment => 
                 segment.x === playerPosition.value.x && segment.y === playerPosition.value.y
               )
      }
      return enemy.x === playerPosition.value.x && enemy.y === playerPosition.value.y
    })
    
    if (enemyCollision) {
      loadLevel(currentLevel.value)
      score.value = Math.max(0, score.value - 5)
      return true
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

  const movePlayer = (directions) => {
    if (isTransitioning.value) return false

    let newX = playerPosition.value.x
    let newY = playerPosition.value.y
    let moved = false

    // Handle diagonal movement properly
    if (directions.up && directions.left) {
      newY--
      newX--
      moved = true
    } else if (directions.up && directions.right) {
      newY--
      newX++
      moved = true
    } else if (directions.down && directions.left) {
      newY++
      newX--
      moved = true
    } else if (directions.down && directions.right) {
      newY++
      newX++
      moved = true
    } else {
      // Handle cardinal directions
      if (directions.up) {
        newY--
        moved = true
      } else if (directions.down) {
        newY++
        moved = true
      }
      
      if (directions.left) {
        newX--
        moved = true
      } else if (directions.right) {
        newX++
        moved = true
      }
    }

    // Only update position if movement is valid
    if (moved && !isWallTile(newX, newY)) {
      playerPosition.value = { x: newX, y: newY }
      
      // Increment step counter
      playerStepCount.value++
      
      // Move step hunters only on even steps
      if (playerStepCount.value % 2 === 0) {
        enemies.value = enemies.value.map(enemy => {
          if (enemy.type === 'stepHunter') {
            const nextPos = getStepHunterNextPosition(enemy, { x: newX, y: newY })
            return nextPos ? { ...enemy, ...nextPos } : enemy
          }
          return enemy
        })
      }
      
      return true
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
    keyStates,
    enemies,
  }
} 