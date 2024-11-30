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
          <span class="label">COLLECTIBLES</span>
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
    <canvas ref="gameCanvas" width="1000" height="700"></canvas>
    <p class="attribution">
      Made with ☕️ and ❤️ in 🏝️ on 💻 via 🌐 with 👀 and 🙌 by 
      <a href="https://x.com/erwin_ai" target="_blank" class="social-link">Erwin</a> /
      <a href="https://bsky.app/profile/erwin.blue" target="_blank" class="social-link">Erwin</a> 🤓
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGameState } from '~/composables/useGameState'
import { useGameRenderer } from '~/composables/useGameRenderer'
import { useGameMusic } from '~/composables/useGameMusic'

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
} = useGameState()
const { initGame, drawGame, stopAnimation, drawVictoryEffect } = useGameRenderer(
  gameCanvas,
  playerPosition,
  collectibles,
  obstacles,
  currentLevel,
  isTransitioning
)
const { initMusic, playMusic, stopMusic } = useGameMusic()
const musicStarted = ref(false)

const keyStates = ref({
  up: false,
  down: false,
  left: false,
  right: false
})
let moveInterval = null

let victoryAnimation = null

const handleKeyDown = (event) => {
  // Prevent page scrolling
  event.preventDefault()
  
  if (isTransitioning.value) return

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
  }
}

const movePlayer = () => {
  if (isTransitioning.value) return

  const oldPosition = { ...playerPosition.value }
  
  if (keyStates.value.up && playerPosition.value.y > 0) playerPosition.value.y--
  if (keyStates.value.down && playerPosition.value.y < 19) playerPosition.value.y++
  if (keyStates.value.left && playerPosition.value.x > 0) playerPosition.value.x--
  if (keyStates.value.right && playerPosition.value.x < 19) playerPosition.value.x++
  
  if (oldPosition.x !== playerPosition.value.x || 
      oldPosition.y !== playerPosition.value.y) {
    const levelChanged = checkCollisions()
    drawGame()
    
    if (levelChanged) {
      const redrawInterval = setInterval(() => {
        drawGame()
      }, 50)
      
      setTimeout(() => {
        clearInterval(redrawInterval)
        drawGame()
      }, 600)
    }
  }
}

const startGameMusic = () => {
  musicStarted.value = true
  playMusic(currentLevel.value)
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
})

const showDeviceWarning = ref(false)

onMounted(() => {
  initializeGame()
  initGame()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  moveInterval = setInterval(movePlayer, 100) // Adjust this value to control movement speed

  const checkDevice = () => {
    showDeviceWarning.value = 
      window.innerWidth < 768 || 
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)
  }
  
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  clearInterval(moveInterval)
  stopAnimation()
  stopMusic()
  window.removeEventListener('resize', checkDevice)
})
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
  background-color: #4834d4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.music-button:hover {
  background-color: #686de0;
  transform: translateY(-2px);
}

.music-button.stop {
  background-color: #e74c3c;
}

.music-button.stop:hover {
  background-color: #c0392b;
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
  border-radius: 4px;
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
  color: #4834d4;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #686de0;
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
</style> 