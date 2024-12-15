<template>
  <div class="game-container">
    <div class="device-warning" v-if="showDeviceWarning">
      <div class="warning-content">
        <h2>Desktop Only Game</h2>
        <p>This game requires a keyboard and is designed for desktop computers.</p>
        <p>Please visit on a desktop device to play!</p>
      </div>
    </div>
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
          <span class="label">G0LD IN LEVEL</span>
          <span class="value">{{ collectibles.length }}</span>
        </div>
      </div>
      <div class="controls">
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
    <p class="attribution">
      Made with ☕️ and ❤️ in 🏝️ on 💻 via 🌐 with 👀 and 🙌 by 
      <a href="https://x.com/erwin_ai" target="_blank" class="social-link">Erwin (X)</a> /
      <a href="https://bsky.app/profile/erwin.blue" target="_blank" class="social-link">Erwin (BSKY)</a> 🤓
    </p>
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
} = useGameState()
const { currentTutorial, showTutorial, checkForTutorial, closeTutorial } = useTutorials()
const tutorialButtonBounds = ref(null)

const onTutorialButtonBoundsChange = (bounds) => {
  tutorialButtonBounds.value = bounds
}

const { initGame, drawGame, drawVictoryEffect, stopAnimation } = useGameRenderer(
  gameCanvas,
  playerPosition,
  collectibles,
  obstacles,
  currentLevel,
  isTransitioning,
  showTutorial,
  currentTutorial,
  onTutorialButtonBoundsChange,
  enemies
)
const { initMusic, playMusic, stopMusic } = useGameMusic()
const musicStarted = ref(false)

let lastMoveTime = 0
const moveDelay = 150 // Base delay
let animationFrameId = null
let victoryAnimation = null
let collisionInterval = null

const keyHeld_Up = ref(false)
const keyHeld_Down = ref(false)
const keyHeld_Left = ref(false)
const keyHeld_Right = ref(false)
const keyHeld_Shift = ref(false)

const handleKeyDown = (event) => {
  event.preventDefault()
  
  if (isTransitioning.value || isVictorious.value) return

  // Handle cheat codes and music controls
  switch (event.key) {
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
    case '/':
      showMusicControls.value = !showMusicControls.value
      return
  }

  // Handle movement keys
  switch (event.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      keyHeld_Up.value = true
      break
    case 's':
    case 'arrowdown':
      keyHeld_Down.value = true
      break
    case 'a':
    case 'arrowleft':
      keyHeld_Left.value = true
      break
    case 'd':
    case 'arrowright':
      keyHeld_Right.value = true
      break
    case 'shift':
      keyHeld_Shift.value = true
      break
  }
}

const handleKeyUp = (event) => {
  switch (event.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      keyHeld_Up.value = false
      break
    case 's':
    case 'arrowdown':
      keyHeld_Down.value = false
      break
    case 'a':
    case 'arrowleft':
      keyHeld_Left.value = false
      break
    case 'd':
    case 'arrowright':
      keyHeld_Right.value = false
      break
    case 'shift':
      keyHeld_Shift.value = false
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
  
  const currentTime = performance.now()
  const baseDelay = 150
  const currentDelay = keyHeld_Shift.value ? baseDelay * 0.5 : baseDelay
  
  if (currentTime - lastMoveTime >= currentDelay) {
    let moved = false
    
    // Only attempt movement if any key is held
    if (keyHeld_Up.value || keyHeld_Down.value || keyHeld_Left.value || keyHeld_Right.value) {
      moved = movePlayer({
        up: keyHeld_Up.value,
        down: keyHeld_Down.value,
        left: keyHeld_Left.value,
        right: keyHeld_Right.value
      })
      
      if (moved) {
        drawGame()
        lastMoveTime = currentTime
      }
    }
  }
  
  animationFrameId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('blur', cleanupKeyStates)
  animationFrameId = requestAnimationFrame(gameLoop)
  collisionInterval = setInterval(() => {
    checkCollisions()
  }, 100)

  setupInitialGame()

  const checkDevice = () => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    
    showDeviceWarning.value = 
      (window.innerWidth < 768 && isMobileDevice) || 
      (window.innerWidth < 768 && 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)
  }
  
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('blur', cleanupKeyStates)
  cancelAnimationFrame(animationFrameId)
  clearInterval(collisionInterval)
  stopAnimation()
  stopMusic()
  cleanupKeyStates()
  window.removeEventListener('resize', checkDevice)
})

const playMusicVariation = (level) => {
  musicStarted.value = true
  playMusic(level)
}

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

const cleanupKeyStates = () => {
  keyHeld_Up.value = false
  keyHeld_Down.value = false
  keyHeld_Left.value = false
  keyHeld_Right.value = false
  keyHeld_Shift.value = false
  lastMoveTime = 0
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
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000;
  color: white;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  padding: 20px;
}

.game-info {
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
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

canvas {
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.music-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: 1.5px solid #ffffff;
  border-radius: 0;
  cursor: pointer;
  font-size: 16px;
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

.attribution {
  margin-top: 15px;
  color: #888;
  font-size: 14px;
  text-align: center;
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
</style> 