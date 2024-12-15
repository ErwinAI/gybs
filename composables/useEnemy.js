import { ref } from 'vue'

export function useEnemy() {
  const getWallHuggerNextPosition = (enemy, walls, gridSize) => {
    const direction = enemy.direction || 'right'
    
    const directions = {
      right: { dx: 1, dy: 0, next: 'down', check: { dx: 0, dy: 1 } },
      down: { dx: 0, dy: 1, next: 'left', check: { dx: -1, dy: 0 } },
      left: { dx: -1, dy: 0, next: 'up', check: { dx: 0, dy: -1 } },
      up: { dx: 0, dy: -1, next: 'right', check: { dx: 1, dy: 0 } }
    }
    
    const current = directions[direction]
    const nextX = enemy.x + current.dx
    const nextY = enemy.y + current.dy
    
    // First check if next position is a wall
    if (isWall(nextX, nextY, walls, gridSize)) {
      // Hit a wall, turn
      return {
        x: enemy.x,
        y: enemy.y,
        direction: current.next
      }
    }
    
    // Then check if we still have a wall to follow
    const checkX = enemy.x + current.check.dx
    const checkY = enemy.y + current.check.dy
    
    if (isWall(checkX, checkY, walls, gridSize)) {
      // Wall is there, keep going
      return {
        x: nextX,
        y: nextY,
        direction
      }
    }
    
    // Lost the wall, turn
    return {
      x: enemy.x,
      y: enemy.y,
      direction: current.next
    }
  }

  const getPatrollerNextPosition = (enemy) => {
    // If no path defined, don't move
    if (!enemy.path || enemy.path.length < 2) return null
    
    // Get current position in path
    const currentPathIndex = enemy.pathIndex || 0
    const isReversed = enemy.isReversed || false
    
    // Get next position based on direction
    const nextIndex = isReversed ? currentPathIndex - 1 : currentPathIndex + 1
    
    // Check if we need to reverse direction
    if (nextIndex >= enemy.path.length || nextIndex < 0) {
      return {
        x: enemy.x,
        y: enemy.y,
        pathIndex: isReversed ? 0 : enemy.path.length - 1,
        isReversed: !isReversed
      }
    }
    
    // Get next position
    const nextPos = enemy.path[nextIndex]
    
    // Only move if the next position is adjacent
    const dx = Math.abs(nextPos[0] - enemy.x)
    const dy = Math.abs(nextPos[1] - enemy.y)
    if (dx + dy !== 1) {
      console.warn('Invalid patroller path: positions must be adjacent')
      return enemy
    }
    
    return {
      x: nextPos[0],
      y: nextPos[1],
      pathIndex: nextIndex,
      isReversed: isReversed
    }
  }

  const getSnakeNextPosition = (enemy, walls, gridSize) => {
    // Snake follows its path, but has a body that follows the head
    const segments = enemy.segments || []
    const head = { x: enemy.x, y: enemy.y }
    
    // Get next position based on current direction
    let nextX = head.x
    let nextY = head.y
    
    switch (enemy.direction) {
      case 'right': nextX++; break
      case 'left': nextX--; break
      case 'up': nextY--; break
      case 'down': nextY++; break
    }
    
    // Check for walls and change direction
    if (isWall(nextX, nextY, walls, gridSize)) {
      // Try turning clockwise
      const directions = ['right', 'down', 'left', 'up']
      const currentIndex = directions.indexOf(enemy.direction)
      for (let i = 1; i <= 4; i++) {
        const newDirection = directions[(currentIndex + i) % 4]
        nextX = head.x
        nextY = head.y
        
        switch (newDirection) {
          case 'right': nextX++; break
          case 'left': nextX--; break
          case 'up': nextY--; break
          case 'down': nextY++; break
        }
        
        if (!isWall(nextX, nextY, walls, gridSize)) {
          // Update segments
          segments.unshift({ x: head.x, y: head.y })
          if (segments.length > enemy.length - 1) segments.pop()
          
          return {
            x: nextX,
            y: nextY,
            direction: newDirection,
            segments
          }
        }
      }
      return enemy // Stuck, don't move
    }
    
    // Update segments
    segments.unshift({ x: head.x, y: head.y })
    if (segments.length > enemy.length - 1) segments.pop()
    
    return {
      x: nextX,
      y: nextY,
      direction: enemy.direction,
      segments
    }
  }

  const getHunterNextPosition = (enemy, playerPos) => {
    // Hunter tries to move toward the player using A* pathfinding
    // For simplicity, we'll use a basic approach here
    const dx = Math.sign(playerPos.x - enemy.x)
    const dy = Math.sign(playerPos.y - enemy.y)
    
    // Prefer moving in the direction with larger distance
    if (Math.abs(playerPos.x - enemy.x) > Math.abs(playerPos.y - enemy.y)) {
      return { x: enemy.x + dx, y: enemy.y }
    } else {
      return { x: enemy.x, y: enemy.y + dy }
    }
  }

  const getTeleporterNextPosition = (enemy, gridSize) => {
    // Teleporter randomly appears in new positions every few moves
    enemy.moveCount = (enemy.moveCount || 0) + 1
    
    if (enemy.moveCount >= enemy.teleportFrequency) {
      return {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        moveCount: 0
      }
    }
    
    return enemy
  }

  const getSpinnerNextPosition = (enemy) => {
    // Spinner rotates around its center point
    const angle = ((enemy.angle || 0) + enemy.rotationSpeed) % 360
    const radius = enemy.radius || 2
    
    // Convert angle to radians
    const radians = (angle * Math.PI) / 180
    
    return {
      x: Math.round(enemy.centerX + radius * Math.cos(radians)),
      y: Math.round(enemy.centerY + radius * Math.sin(radians)),
      angle,
      centerX: enemy.centerX,
      centerY: enemy.centerY,
      radius: enemy.radius,
      rotationSpeed: enemy.rotationSpeed
    }
  }

  const getStepHunterNextPosition = (enemy, playerPos) => {
    // Only move when called (player moves)
    const dx = Math.sign(playerPos.x - enemy.x)
    const dy = Math.sign(playerPos.y - enemy.y)
    
    // Move one step towards player (prioritize larger distance)
    if (Math.abs(playerPos.x - enemy.x) >= Math.abs(playerPos.y - enemy.y)) {
      return {
        x: enemy.x + dx,
        y: enemy.y
      }
    } else {
      return {
        x: enemy.x,
        y: enemy.y + dy
      }
    }
  }

  // Helper function to check wall collisions
  const isWall = (x, y, walls, gridSize) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return true
    return walls?.some(([wx, wy]) => wx === x && wy === y) || false
  }

  return {
    getWallHuggerNextPosition,
    getPatrollerNextPosition,
    getSnakeNextPosition,
    getHunterNextPosition,
    getTeleporterNextPosition,
    getSpinnerNextPosition,
    getStepHunterNextPosition
  }
} 