import { ref } from 'vue'
import { levels } from './gameLevels'

export function useGameRenderer(canvasRef, playerPosition, collectibles, obstacles, currentLevel, isTransitioning) {
  const ctx = ref(null)
  const gridSize = 20
  const wallThickness = 2 // Number of wall tiles on each side
  const totalSize = gridSize + (wallThickness * 2) // Total grid size including walls
  const tileSize = 30
  const offsetX = 500
  const offsetY = 150
  let animationFrameId = null

  const drawIsometricTile = (x, y, color, isWall = false) => {
    const isoX = (x - y) * (tileSize / 2)
    const isoY = (x + y) * (tileSize / 4)

    ctx.value.save()
    ctx.value.translate(offsetX + isoX, offsetY + isoY)

    // Draw tile
    ctx.value.beginPath()
    ctx.value.moveTo(0, 0)
    ctx.value.lineTo(tileSize / 2, tileSize / 4)
    ctx.value.lineTo(0, tileSize / 2)
    ctx.value.lineTo(-tileSize / 2, tileSize / 4)
    ctx.value.closePath()
    ctx.value.fillStyle = color
    ctx.value.fill()
    
    // Special border for wall tiles
    if (isWall) {
      ctx.value.strokeStyle = '#ffffff'
      ctx.value.lineWidth = 1.5
    } else {
      ctx.value.strokeStyle = '#000000'
      ctx.value.lineWidth = 1
    }
    ctx.value.stroke()

    ctx.value.restore()
  }

  const isCollectibleAt = (x, y) => {
    return collectibles.value.some(c => c.x === x && c.y === y)
  }

  const isWallTile = (x, y) => {
    return x < 0 || x >= gridSize || y < 0 || y >= gridSize
  }

  const isInBounds = (x, y) => {
    return x >= 0 && x < gridSize && y >= 0 && y < gridSize
  }

  const animate = () => {
    drawGame()
    animationFrameId = requestAnimationFrame(animate)
  }

  const drawFinishTile = (x, y) => {
    const isoX = (x - y) * (tileSize / 2)
    const isoY = (x + y) * (tileSize / 4)

    // Draw 2x2 grid of checkered tiles
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy < 2; dy++) {
        const tileX = x + dx
        const tileY = y + dy
        const localIsoX = (tileX - tileY) * (tileSize / 2)
        const localIsoY = (tileX + tileY) * (tileSize / 4)

        ctx.value.save()
        ctx.value.translate(offsetX + localIsoX, offsetY + localIsoY)

        // Draw base tile
        ctx.value.beginPath()
        ctx.value.moveTo(0, 0)
        ctx.value.lineTo(tileSize / 2, tileSize / 4)
        ctx.value.lineTo(0, tileSize / 2)
        ctx.value.lineTo(-tileSize / 2, tileSize / 4)
        ctx.value.closePath()

        // Create checkered pattern within each tile
        const isBlackTile = (dx + dy) % 2 === 0
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const isBlackSquare = (i + j) % 2 === (isBlackTile ? 0 : 1)
            ctx.value.fillStyle = isBlackSquare ? '#000000' : '#ffffff'

            // Calculate isometric sub-tile coordinates
            const subTileSize = tileSize / 4
            const startX = -tileSize/2 + i*subTileSize
            const startY = tileSize/4 - j*subTileSize/2

            // Draw isometric sub-tile
            ctx.value.beginPath()
            ctx.value.moveTo(startX, startY)
            ctx.value.lineTo(startX + subTileSize, startY)
            ctx.value.lineTo(startX + subTileSize/2, startY - subTileSize/4)
            ctx.value.lineTo(startX - subTileSize/2, startY - subTileSize/4)
            ctx.value.fill()
          }
        }

        // Add golden border to each tile
        ctx.value.strokeStyle = '#ffd700'
        ctx.value.lineWidth = 2
        ctx.value.stroke()

        ctx.value.restore()
      }
    }
  }

  const drawVictoryEffect = (progress) => {
    // Draw expanding circles from the center
    const centerX = offsetX
    const centerY = offsetY + gridSize * (tileSize / 4)
    
    ctx.value.save()
    ctx.value.globalAlpha = 1 - progress // Fade out as progress increases
    
    // Draw multiple circles
    for (let i = 0; i < 5; i++) {
      const radius = progress * (300 + i * 100)
      ctx.value.beginPath()
      ctx.value.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.value.strokeStyle = `hsl(${(i * 50 + progress * 360) % 360}, 70%, 50%)`
      ctx.value.lineWidth = 10 - i
      ctx.value.stroke()
    }
    
    ctx.value.restore()
  }

  const drawGame = () => {
    if (!ctx.value) return

    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    ctx.value.globalAlpha = 1

    const level = levels[currentLevel.value]

    // Draw base grid with walls
    for (let y = -wallThickness; y < gridSize + wallThickness; y++) {
      for (let x = -wallThickness; x < gridSize + wallThickness; x++) {
        if (isWallTile(x, y)) {
          drawIsometricTile(x, y, '#000000', true)
        } else {
          drawIsometricTile(x, y, '#f8f9fa')
        }
      }
    }

    // Draw portals and finish tile
    if (level.up) {
      drawIsometricTile(level.up.x, level.up.y, '#4834d4')
    }
    if (level.down) {
      drawIsometricTile(level.down.x, level.down.y, '#6ab04c')
    }
    if (level.finish) {
      drawFinishTile(level.finish.x, level.finish.y)
    }

    // Draw collectibles that don't overlap with obstacles
    collectibles.value.forEach(collectible => {
      if (!obstacles.value.some(o => o.x === collectible.x && o.y === collectible.y)) {
        drawIsometricTile(collectible.x, collectible.y, '#ffd32a')
      }
    })

    // Draw obstacles (and overlapping collectibles), but only if in bounds
    obstacles.value
      .filter(obstacle => isInBounds(obstacle.x, obstacle.y))
      .forEach(obstacle => {
        const color = isCollectibleAt(obstacle.x, obstacle.y) ? '#ff8c42' : '#ff4757'
        drawIsometricTile(obstacle.x, obstacle.y, color)
      })

    // Draw player with flash effect if transitioning
    if (isTransitioning.value) {
      const flashSpeed = 100
      const currentFlash = Math.floor(Date.now() / flashSpeed) % 2
      const playerColor = currentFlash === 0 ? '#d6b4e7' : '#9b59b6'
      drawIsometricTile(playerPosition.value.x, playerPosition.value.y, playerColor)
    } else {
      drawIsometricTile(playerPosition.value.x, playerPosition.value.y, '#9b59b6')
    }
  }

  const stopAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }

  return {
    initGame: () => {
      ctx.value = canvasRef.value.getContext('2d')
      animate()
    },
    drawGame,
    drawVictoryEffect,
    stopAnimation
  }
} 