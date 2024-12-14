export function useGameControls(loadLevel, drawGame, currentLevel, isTransitioning, isVictorious) {
  const keyStates = ref({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  })

  const isMobileDevice = ref(false)
  const trackpadPosition = ref({ left: '50%', top: '50%' })

  const handleTrackpadTouch = (event) => {
    // ... paste the entire function from index.vue ...
  }

  const resetMovement = () => {
    keyStates.value.up = false
    keyStates.value.down = false
    keyStates.value.left = false
    keyStates.value.right = false
    trackpadPosition.value = { left: '50%', top: '50%' }
  }

  // ... existing keyboard handlers ...

  return {
    keyStates,
    handleKeyDown,
    handleKeyUp,
    isMobileDevice,
    trackpadPosition,
    handleTrackpadTouch,
    resetMovement
  }
} 