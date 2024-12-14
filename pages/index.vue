<template>
  <div class="game-container">
    <div class="top-section">
      <div class="game-info">
        <div class="stats">
          <div class="stat-item">
            <span class="label">SCORE</span>
            <span class="value">{{ score }}</span>
          </div>
          <div class="stat-item">
            <span class="label">LEVEL</span>
            <span class="value">{{ currentLevel }}</span>
          </div>
          <div class="stat-item">
            <span class="label">COLLECTIBLES</span>
            <span class="value">{{ collectibles.length }}</span>
          </div>
        </div>
      </div>
      <div class="music-controls-top">
        <button 
          v-if="!musicStarted" 
          @click="startGameMusic" 
          class="music-button"
        >
          Start Music 🎵
        </button>
        <button 
          v-else
          @click="stopGameMusic" 
          class="music-button stop"
        >
          Stop Music 🔇
        </button>
      </div>
    </div>
    <canvas 
      ref="gameCanvas" 
      width="1000" 
      height="600"
      @click="handleCanvasClick"
    ></canvas>
    <div class="bottom-section">
      <div v-if="isMobileDevice" class="mobile-controls">
        <div 
          class="virtual-trackpad"
          @touchstart="handleTrackpadTouch"
          @touchmove="handleTrackpadTouch"
          @touchend="resetMovement"
        >
          <div class="trackpad-outer">
            <div 
              class="trackpad-inner"
              :style="trackpadPosition"
            ></div>
          </div>
        </div>
        <button 
          class="dash-button"
          @touchstart="keyStates.shift = true"
          @touchend="keyStates.shift = false"
        >
          DASH
        </button>
      </div>
      <p class="attribution">
        Made with ☕️ and ❤️ in 🏝️ on 💻 via 🌐 with 👀 and 🙌 by 
        <a href="https://x.com/erwin_ai" target="_blank" class="social-link">Erwin (X)</a> /
        <a href="https://bsky.app/profile/erwin.blue" target="_blank" class="social-link">Erwin (BSKY)</a> 🤓
      </p>
    </div>
    <ClientOnly>
      <div style="display: none" @vue:mounted="initializeMusic"></div>
    </ClientOnly>
    <div v-if="isVictorious" class="victory-overlay">
      <div class="victory-content">
        <h1>VICTORY!</h1>
        <p>Final Score: {{ score }}</p>
        <button @click="restartGame" class="restart-button">Play Again</button>
      </div>
    </div>
    <div class="music-controls" :class="{ 'hidden': !showMusicControls }">
      <div class="controls-content">
        <h3>Music Controls</h3>
        <div class="button-grid">
          <button @click="playMusicVariation(1)">Calm (1-5)</button>
          <button @click="playMusicVariation(6)">Tense (6-10)</button>
          <button @click="playMusicVariation(11)">Panic (11-15)</button>
          <button @click="playMusicVariation(16)">Intense (16-20)</button>
          <button @click="playMusicVariation(21)">Sinister (21-25)</button>
          <button @click="playMusicVariation(26)">Frenzy (26+)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGameState } from '~/composables/useGameState'
import { useGameRenderer } from '~/composables/useGameRenderer'
import { useGameMusic } from '~/composables/useGameMusic'
import { useTutorials } from '~/composables/useTutorials'

const gameCanvas = ref(null)
const {
  playerPosition,
  collectibles,
  obstacles,
  score,
  currentLevel,
  isTransitioning,
  initializeGame,
  checkCollisions,
  loadLevel,
  isVictorious,
  movePlayer,
  keyStates,
} = useGameState()
const { currentTutorial, showTutorial, checkForTutorial, closeTutorial } = useTutorials()
const { initGame, drawGame, stopAnimation, drawVictoryEffect, drawTutorial } = useGameRenderer(
  gameCanvas,
  playerPosition,
  collectibles,
  obstacles,
  currentLevel,
  isTransitioning,
  showTutorial,
  currentTutorial,
  (bounds) => {
    tutorialButtonBounds.value = bounds
  }
)
const { initMusic, playMusic, stopMusic } = useGameMusic()
const musicStarted = ref(false)

let lastMoveTime = 0
const moveDelay = 150 // Base delay
let animationFrameId = null
let victoryAnimation = null
let collisionInterval = null

const handleKeyDown = (event) => {
  event.preventDefault()
  
  if (isTransitioning.value || isVictorious.value) return

  switch (event.key) {
    // CHEAT CODES - Remove for production
    case '[':
      if (currentLevel.value > 1) {
        currentLevel.value--
        loadLevel(currentLevel.value)
        drawGame()
      }
      return
    case ']':
      currentLevel.value++
      loadLevel(currentLevel.value)
      drawGame()
      return
    // END CHEAT CODES
    
    case 'w':
    case 'ArrowUp':
      keyStates.value.up = true
      break
    case 's':
    case 'ArrowDown':
      keyStates.value.down = true
      break
    case 'a':
    case 'ArrowLeft':
      keyStates.value.left = true
      break
    case 'd':
    case 'ArrowRight':
      keyStates.value.right = true
      break
    case 'Shift':
      keyStates.value.shift = true
      break
    case '/':
      showMusicControls.value = !showMusicControls.value
      return
  }
}

const handleKeyUp = (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keyStates.value.up = false
      break
    case 's':
    case 'ArrowDown':
      keyStates.value.down = false
      break
    case 'a':
    case 'ArrowLeft':
      keyStates.value.left = false
      break
    case 'd':
    case 'ArrowRight':
      keyStates.value.right = false
      break
    case 'Shift':
      keyStates.value.shift = false
      break
  }
}

const startGameMusic = () => {
  musicStarted.value = true
  playMusic(currentLevel.value, 'normal')
}

const stopGameMusic = () => {
  musicStarted.value = false
  stopMusic()
}

const initializeMusic = () => {
  console.log('Initializing music...')
  
  // Check if script exists in DOM
  const scriptExists = document.querySelector('script[src="/js/band.min.js"]')
  console.log('Band.js script tag exists?', !!scriptExists)
  
  // Try to load it manually if not found
  if (!scriptExists && typeof window.BandJS === 'undefined') {
    console.log('Attempting manual script load...')
    const script = document.createElement('script')
    script.src = '/js/band.min.js'
    script.onload = () => {
      console.log('Manual script load complete')
      initMusic()
    }
    document.head.appendChild(script)
    return
  }
  
  console.log('Band.js loaded?', typeof window.BandJS !== 'undefined')
  initMusic()
}

const handleVictory = () => {
  let progress = 0
  victoryAnimation = setInterval(() => {
    progress += 0.02
    if (progress >= 1) {
      clearInterval(victoryAnimation)
    }
    drawVictoryEffect(progress)
  }, 16)
}

const restartGame = () => {
  isVictorious.value = false
  if (victoryAnimation) {
    clearInterval(victoryAnimation)
  }
  initializeGame()
}

watch(isVictorious, (newValue) => {
  if (newValue) {
    handleVictory()
  }
})

watch(currentLevel, (newLevel) => {
  if (musicStarted.value) {
    playMusic(newLevel)
  }
  checkForTutorial(newLevel)
})

const showDeviceWarning = ref(false)
const showMusicControls = ref(false)

const handleTutorialClose = () => {
  closeTutorial()
}

const setupInitialGame = () => {
  initializeGame()
  checkForTutorial(1)
  startGame()
}

const startGame = () => {
  if (!gameCanvas.value) return
  initGame()
}

const gameLoop = (timestamp) => {
  if (isVictorious.value) return
  
  const currentDelay = keyStates.value.shift ? moveDelay * 0.5 : moveDelay
  
  if (timestamp - lastMoveTime >= currentDelay) {
    const moved = movePlayer()
    if (moved) {
      drawGame()
    }
    lastMoveTime = timestamp
  }
  animationFrameId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  animationFrameId = requestAnimationFrame(gameLoop)
  collisionInterval = setInterval(() => {
    checkCollisions()
  }, 100)

  setupInitialGame()

  const checkDevice = () => {
    isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || (window.innerWidth < 768 && 'ontouchstart' in window)
    
    if (isMobileDevice.value) {
      showDeviceWarning.value = false // Allow mobile play now
      resizeCanvas()
    }
  }
  
  checkDevice()
  window.addEventListener('resize', checkDevice)
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  cancelAnimationFrame(animationFrameId)
  clearInterval(collisionInterval) // Clear the new interval
  stopAnimation()
  stopMusic()
  window.removeEventListener('resize', checkDevice)
  window.removeEventListener('resize', resizeCanvas)
})

const playMusicVariation = (level) => {
  musicStarted.value = true
  playMusic(level)
}

const tutorialButtonBounds = ref(null)

const handleCanvasClick = (event) => {
  if (!showTutorial.value || !tutorialButtonBounds.value) return

  const rect = gameCanvas.value.getBoundingClientRect()
  
  // Calculate scale factors
  const scaleX = gameCanvas.value.width / rect.width
  const scaleY = gameCanvas.value.height / rect.height
  
  // Get click position and scale it to match canvas coordinates
  const x = (event.clientX - rect.left) * scaleX
  const y = (event.clientY - rect.top) * scaleY
  
  // Check if click is within continue button bounds
  const bounds = tutorialButtonBounds.value
  if (x >= bounds.x && x <= bounds.x + bounds.width &&
      y >= bounds.y && y <= bounds.y + bounds.height) {
    handleTutorialClose()
  }
}

const isMobileDevice = ref(false)
const trackpadPosition = ref({ left: '50%', top: '50%' })

const handleTrackpadTouch = (event) => {
  event.preventDefault()
  const touch = event.touches[0]
  const trackpad = event.currentTarget
  const rect = trackpad.getBoundingClientRect()
  
  // Calculate center of trackpad
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  // Calculate distance from center
  const deltaX = touch.clientX - centerX
  const deltaY = touch.clientY - centerY
  
  // Calculate normalized direction (-1 to 1)
  const maxDistance = rect.width / 2
  const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance))
  const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance))
  
  // Update trackpad visual position (constrained within outer circle)
  const angle = Math.atan2(deltaY, deltaX)
  const distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY))
  const visualX = Math.cos(angle) * distance
  const visualY = Math.sin(angle) * distance
  
  trackpadPosition.value = {
    left: `calc(50% + ${visualX}px)`,
    top: `calc(50% + ${visualY}px)`
  }
  
  // Update movement state
  keyStates.value.left = normalizedX < -0.3
  keyStates.value.right = normalizedX > 0.3
  keyStates.value.up = normalizedY < -0.3
  keyStates.value.down = normalizedY > 0.3
}

const resetMovement = () => {
  keyStates.value.up = false
  keyStates.value.down = false
  keyStates.value.left = false
  keyStates.value.right = false
  trackpadPosition.value = { left: '50%', top: '50%' }
}

const resizeCanvas = () => {
  if (!gameCanvas.value) return
  
  const container = document.documentElement // Use viewport instead of container
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  
  // Calculate available height (subtract space for UI)
  const availableHeight = containerHeight - 200 // Space for top and bottom UI
  
  // Calculate scale to fit while maintaining aspect ratio
  const scaleX = containerWidth / 1000 // Original width
  const scaleY = availableHeight / 600 // Original height
  const scale = Math.min(scaleX, scaleY)
  
  // Update canvas size
  gameCanvas.value.style.width = `${1000 * scale}px`
  gameCanvas.value.style.height = `${600 * scale}px`
  
  // Center canvas if it's not full width
  if (1000 * scale < containerWidth) {
    gameCanvas.value.style.marginLeft = `${(containerWidth - (1000 * scale)) / 2}px`
  } else {
    gameCanvas.value.style.marginLeft = '0'
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #000;
  color: white;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  padding: 20px 0;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px 20px;
  width: 100%;
  box-sizing: border-box;
}

.game-info {
  margin-bottom: 0; /* Remove margin since we're using gap in parent */
  text-align: center;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.music-controls-top {
  margin-bottom: 0; /* Remove margin since we're using gap in parent */
  text-align: center;
}

canvas {
  margin: auto;
  width: 100vw;
  height: auto;
  background-color: #1a1a1a;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border-radius: 0;
}

.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.attribution {
  margin-top: 0; /* Remove margin since we're using gap in parent */
  color: #888;
  font-size: 12px; /* Slightly smaller text */
  text-align: center;
}

.stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.label {
  font-size: 14px;
  color: #888;
  letter-spacing: 1px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.controls {
  display: flex;
  gap: 10px;
}

.music-button {
  padding: 8px 16px;
  background-color: #000000;
  color: white;
  border: 1.5px solid #ffffff;
  border-radius: 0;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.music-button:hover {
  background-color: #1a1a1a;
  transform: translateY(-2px);
}

.music-button.stop {
  background-color: #000000;
  border-color: #ff4757;
  color: #ff4757;
}

.music-button.stop:hover {
  background-color: #1a1a1a;
}

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.victory-content {
  text-align: center;
  padding: 40px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 2px solid #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.victory-content h1 {
  color: #ffd700;
  font-size: 48px;
  margin: 0 0 20px;
}

.restart-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ffd700;
  color: #000;
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.restart-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

.social-link {
  color: #9b59b6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #d6b4e7;
}

.device-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.warning-content {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  border: 2px solid #4834d4;
}

.warning-content h2 {
  color: #4834d4;
  margin-bottom: 15px;
  font-size: 24px;
}

.warning-content p {
  color: #fff;
  margin: 10px 0;
  line-height: 1.4;
}

.music-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}

.music-controls.hidden {
  display: none;
}

.controls-content h3 {
  color: white;
  margin-top: 0;
  margin-bottom: 10px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.button-grid button {
  padding: 8px;
  background: #000000;
  color: white;
  border: 1.5px solid #ffffff;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.button-grid button:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.mobile-controls {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  pointer-events: none;
}

.virtual-trackpad {
  width: 120px;
  height: 120px;
  pointer-events: auto;
}

.trackpad-outer {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
}

.trackpad-inner {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
}

.dash-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(155, 89, 182, 0.8);
  border: none;
  color: white;
  font-weight: bold;
  font-family: inherit;
  pointer-events: auto;
}

.dash-button:active {
  background: rgba(155, 89, 182, 1);
  transform: scale(0.95);
}
</style> 