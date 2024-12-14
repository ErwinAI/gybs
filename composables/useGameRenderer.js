import { ref } from 'vue'
import { levels } from './gameLevels'

export function useGameRenderer(
  canvasRef, 
  playerPosition, 
  collectibles, 
  obstacles, 
  currentLevel, 
  isTransitioning,
  showTutorial, 
  currentTutorial,
  onTutorialButtonBoundsChange
) {
  const ctx = ref(null)
  const gridSize = 20
  const wallThickness = 2 // Number of wall tiles on each side
  const totalSize = gridSize + (wallThickness * 2) // Total grid size including walls
  const tileSize = 30
  let animationFrameId = null

  // Add debouncing for canvas updates
  let lastDrawTime = 0
  const FRAME_RATE = 60 // Target 60 FPS
  const FRAME_DELAY = 1000 / FRAME_RATE

  const getOffsets = (ctx) => {
    const offsetX = ctx.canvas.width / 2
    const offsetY = ctx.canvas.height / 3 // Position game grid in upper third
    return { offsetX, offsetY }
  }

  const drawIsometricTile = (x, y, color, isWall = false, offsets) => {
    const isoX = (x - y) * (tileSize / 2)
    const isoY = (x + y) * (tileSize / 4)

    ctx.value.save()
    ctx.value.translate(offsets.offsetX + isoX, offsets.offsetY + isoY)

    // Pre-calculate path points
    const points = [
      [0, 0],
      [tileSize / 2, tileSize / 4],
      [0, tileSize / 2],
      [-tileSize / 2, tileSize / 4]
    ]

    // Draw tile in a single path
    ctx.value.beginPath()
    ctx.value.moveTo(...points[0])
    points.slice(1).forEach(point => ctx.value.lineTo(...point))
    ctx.value.closePath()
    
    // Fill and stroke in one go
    ctx.value.fillStyle = color
    ctx.value.fill()
    ctx.value.strokeStyle = isWall ? '#ffffff' : '#000000'
    ctx.value.lineWidth = isWall ? 1.5 : 1
    ctx.value.stroke()

    ctx.value.restore()
  }

  const isCollectibleAt = (x, y) => {
    return collectibles.value.some(c => c.x === x && c.y === y)
  }

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

  const isInBounds = (x, y) => {
    return x >= 0 && x < gridSize && y >= 0 && y < gridSize
  }

  const animate = () => {
    if (!ctx.value) return
    
    const now = performance.now()
    if (now - lastDrawTime >= FRAME_DELAY) {
      drawGame()
      if (showTutorial.value && currentTutorial.value) {
        const bounds = drawTutorial(currentTutorial.value)
        if (onTutorialButtonBoundsChange) {
          onTutorialButtonBoundsChange(bounds.buttonBounds)
        }
      }
      lastDrawTime = now
    }
    
    animationFrameId = requestAnimationFrame(animate)
  }

  const drawVictoryEffect = (progress) => {
    const offsets = getOffsets(ctx.value)
    const centerX = offsets.offsetX
    const centerY = offsets.offsetY + gridSize * (tileSize / 4)
    
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

    const offsets = getOffsets(ctx.value)
    const level = levels[currentLevel.value]

    // Draw base grid with walls
    for (let y = -wallThickness; y < gridSize + wallThickness; y++) {
      for (let x = -wallThickness; x < gridSize + wallThickness; x++) {
        if (isWallTile(x, y)) {
          drawIsometricTile(x, y, '#000000', true, offsets)
        } else {
          drawIsometricTile(x, y, '#f8f9fa', false, offsets)
        }
      }
    }

    // Draw level-specific walls
    if (level.walls) {
      level.walls.forEach(([x, y]) => {
        drawIsometricTile(x, y, '#000000', true, offsets)
      })
    }

    // Draw portals
    if (Array.isArray(level.up)) {
      level.up.forEach(portal => {
        drawIsometricTile(portal.x, portal.y, '#4834d4', false, offsets)
      })
    } else if (level.up) {
      drawIsometricTile(level.up.x, level.up.y, '#4834d4', false, offsets)
    }
    
    if (Array.isArray(level.down)) {
      level.down.forEach(portal => {
        drawIsometricTile(portal.x, portal.y, '#6ab04c', false, offsets)
      })
    } else if (level.down) {
      drawIsometricTile(level.down.x, level.down.y, '#6ab04c', false, offsets)
    }

    // Draw collectibles that don't overlap with obstacles
    collectibles.value.forEach(collectible => {
      if (!obstacles.value.some(o => o.x === collectible.x && o.y === collectible.y)) {
        drawIsometricTile(collectible.x, collectible.y, '#ffd32a', false, offsets)
      }
    })

    // Draw obstacles (and overlapping collectibles)
    obstacles.value
      .filter(obstacle => isInBounds(obstacle.x, obstacle.y))
      .forEach(obstacle => {
        const color = isCollectibleAt(obstacle.x, obstacle.y) ? '#ff8c42' : '#ff4757'
        drawIsometricTile(obstacle.x, obstacle.y, color, false, offsets)
      })

    // Draw player with flash effect if transitioning
    if (isTransitioning.value) {
      const flashSpeed = 100
      const currentFlash = Math.floor(Date.now() / flashSpeed) % 2
      const playerColor = currentFlash === 0 ? '#d6b4e7' : '#9b59b6'
      drawIsometricTile(playerPosition.value.x, playerPosition.value.y, playerColor, false, offsets)
    } else {
      drawIsometricTile(playerPosition.value.x, playerPosition.value.y, '#9b59b6', false, offsets)
    }
  }

  const stopAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const handleMouseMove = (event) => {
    if (!showTutorial.value || !ctx.value) return
    
    const rect = canvasRef.value.getBoundingClientRect()
    const scaleX = canvasRef.value.width / rect.width
    const scaleY = canvasRef.value.height / rect.height
    const mouseX = (event.clientX - rect.left) * scaleX
    const mouseY = (event.clientY - rect.top) * scaleY

    // Get current button bounds
    const buttonWidth = 160
    const buttonHeight = 40
    const buttonX = (canvasRef.value.width - buttonWidth) / 2
    const buttonY = (canvasRef.value.height + 400) / 2 - 120 // Moved up more

    // Update cursor based on button hover
    if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
      canvasRef.value.style.cursor = 'pointer'
    } else {
      canvasRef.value.style.cursor = 'default'
    }
  }

  const drawTutorial = (tutorial) => {
    if (!ctx.value) return

    // Save current context state
    ctx.value.save()

    // Draw semi-transparent background
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // Tutorial box dimensions
    const boxWidth = 600
    const boxHeight = 400
    const boxX = (canvasRef.value.width - boxWidth) / 2
    const boxY = (canvasRef.value.height - boxHeight) / 2

    // Draw border tiles with smaller size
    const borderTileSize = 20
    const borderThickness = 1
    
    // Calculate how many tiles we need
    const tilesHorizontal = Math.ceil(boxWidth / borderTileSize)
    const tilesVertical = Math.ceil(boxHeight / borderTileSize)
    
    // Draw inner content area first (no gap)
    const contentPadding = borderTileSize // Match border tile size
    const innerX = boxX
    const innerY = boxY
    const innerWidth = boxWidth
    const innerHeight = boxHeight

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.value.beginPath()
    ctx.value.rect(innerX, innerY, innerWidth, innerHeight)
    ctx.value.fill()
    
    // Draw border tiles directly on the edges
    for (let x = 0; x < tilesHorizontal; x++) {
      for (let y = 0; y < tilesVertical; y++) {
        // Only draw if it's a border tile
        if (x === 0 || x === tilesHorizontal - 1 || 
            y === 0 || y === tilesVertical - 1) {
          const tileX = boxX + x * borderTileSize
          const tileY = boxY + y * borderTileSize
          
          // Draw black tile
          ctx.value.fillStyle = '#000000'
          ctx.value.beginPath()
          ctx.value.rect(tileX, tileY, borderTileSize, borderTileSize)
          ctx.value.fill()
          
          // Draw white border
          ctx.value.strokeStyle = '#ffffff'
          ctx.value.lineWidth = 1.5
          ctx.value.stroke()
        }
      }
    }

    // Rest of the content
    const textPadding = 40
    const textStartX = boxX + textPadding
    const textStartY = boxY + textPadding

    // Draw title with shadow
    ctx.value.font = 'bold 28px "JetBrains Mono", monospace'
    ctx.value.textAlign = 'center'
    
    // Draw main title shadow
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.value.fillText(tutorial.title, canvasRef.value.width / 2 + 2, textStartY + 20 + 2)
    
    // Draw main title
    ctx.value.fillStyle = '#9b59b6'
    ctx.value.fillText(tutorial.title, canvasRef.value.width / 2, textStartY + 20)

    // Draw subtitle with shadow
    ctx.value.font = '16px "JetBrains Mono", monospace'
    
    // Draw subtitle shadow
    if (tutorial.subtitle) {
      ctx.value.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.value.fillText(tutorial.subtitle, canvasRef.value.width / 2 + 1, textStartY + 45 + 1)
      ctx.value.fillStyle = '#ffffff'
      ctx.value.fillText(tutorial.subtitle, canvasRef.value.width / 2, textStartY + 45)
    }
    // Draw content with example tiles
    ctx.value.font = '16px "JetBrains Mono", monospace'
    ctx.value.textAlign = 'left' // Always left aligned

    tutorial.content.forEach((line, index) => {
      // Draw example tile
      const tileSize = 20
      const tileX = textStartX + 20
      const tileY = textStartY + 90 + (index * 25) - tileSize/2 // Reduced from 35 to 25

      // Draw different colored tiles based on the line
      let tileColor = '#9b59b6' // Default purple
      if (line.includes('yellow')) tileColor = '#ffd32a'
      if (line.includes('red')) tileColor = '#ff4757'
      if (line.includes('Blue')) tileColor = '#4834d4'
      if (line.includes('Green')) tileColor = '#6ab04c'

      // Draw tile
      ctx.value.fillStyle = tileColor
      ctx.value.beginPath()
      ctx.value.rect(tileX, tileY, tileSize, tileSize)
      ctx.value.fill()
      
      // Add white border for tiles
      ctx.value.strokeStyle = '#ffffff'
      ctx.value.lineWidth = 1.5
      ctx.value.stroke()

      // Draw text
      ctx.value.fillStyle = 'white'
      ctx.value.fillText(
        line, 
        tileX + tileSize + 20, // Add some space after the tile
        textStartY + 100 + (index * 25) // Reduced from 35 to 25
      )
    })

    // Draw continue button
    const buttonWidth = 160
    const buttonHeight = 40
    const buttonX = (canvasRef.value.width - buttonWidth) / 2
    const buttonY = boxY + boxHeight - 120

    // Button background
    ctx.value.fillStyle = '#000000'
    ctx.value.beginPath()
    ctx.value.rect(buttonX, buttonY, buttonWidth, buttonHeight)
    ctx.value.fill()

    // Button border
    ctx.value.strokeStyle = '#ffffff'
    ctx.value.lineWidth = 1.5
    ctx.value.stroke()

    // Button text
    ctx.value.font = '16px "JetBrains Mono", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.fillStyle = 'white'
    ctx.value.fillText('Continue', canvasRef.value.width / 2, buttonY + 25)

    // Add hover effect
    const rect = canvasRef.value.getBoundingClientRect()
    const mouseX = (event?.clientX - rect.left) * (canvasRef.value.width / rect.width)
    const mouseY = (event?.clientY - rect.top) * (canvasRef.value.height / rect.height)

    const isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                     mouseY >= buttonY && mouseY <= buttonY + buttonHeight

    if (isHovered) {
      ctx.value.fillStyle = '#1a1a1a'
      ctx.value.beginPath()
      ctx.value.rect(buttonX, buttonY, buttonWidth, buttonHeight)
      ctx.value.fill()
      ctx.value.strokeStyle = '#ffffff'
      ctx.value.lineWidth = 1.5
      ctx.value.stroke()
      ctx.value.fillStyle = 'white'
      ctx.value.fillText('Continue', canvasRef.value.width / 2, buttonY + 25)
    }

    ctx.value.restore()

    // Add mousemove listener
    canvasRef.value.addEventListener('mousemove', handleMouseMove)

    return {
      buttonBounds: {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
      }
    }
  }

  return {
    initGame: () => {
      if (!canvasRef.value) return
      ctx.value = canvasRef.value.getContext('2d')
      canvasRef.value.addEventListener('mousemove', handleMouseMove)
      animate()
    },
    drawGame,
    drawVictoryEffect,
    drawTutorial,
    stopAnimation
  }
} 