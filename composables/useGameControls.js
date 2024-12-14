import { ref } from 'vue'

export function useGameControls() {
  const keyStates = ref({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  })

  const isMobileDevice = ref(false)
  const trackpadPosition = ref({ left: '50%', top: '50%' })
  const showMusicControls = ref(false)

  const handleKeyDown = (event) => {
    event.preventDefault()
    
    switch (event.key) {
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

  const handleTrackpadTouch = (event) => {
    event.preventDefault()
    const touch = event.touches[0]
    const trackpad = event.currentTarget
    const rect = trackpad.getBoundingClientRect()
    
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = touch.clientX - centerX
    const deltaY = touch.clientY - centerY
    
    // Calculate angle and distance
    const angle = Math.atan2(-deltaY, deltaX)
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = rect.width / 2
    const normalizedDistance = Math.min(1, distance / maxDistance)
    
    // Update visual position (visual feedback matches touch position)
    const visualX = Math.cos(angle) * distance
    const visualY = -Math.sin(angle) * distance  // Negate for visual consistency
    
    // Constrain to square bounds
    const maxX = maxDistance
    const maxY = maxDistance
    const constrainedX = Math.max(-maxX, Math.min(maxX, visualX))
    const constrainedY = Math.max(-maxY, Math.min(maxY, visualY))
    
    trackpadPosition.value = {
      left: `calc(50% + ${constrainedX}px)`,
      top: `calc(50% + ${constrainedY}px)`
    }
    
    if (normalizedDistance > 0.3) {
      // Convert angle to sectors (0-7)
      // IMPORTANT: This calculation maps the angles to correct game directions:
      // 0 = Right, 2 = Down, 4 = Left, 6 = Up
      let degrees = (angle * 180 / Math.PI + 360) % 360
      degrees = (degrees + 22.5) % 360  // Offset to center sectors
      const sector = Math.floor(degrees / 45)
      
      // Reset states
      keyStates.value.up = false
      keyStates.value.down = false
      keyStates.value.left = false
      keyStates.value.right = false
      
      // DO NOT CHANGE THIS SECTOR MAPPING
      switch (sector) {
        case 0: // Right (0°)
          keyStates.value.right = true
          break
        case 1: // Up-Right (45°)
          keyStates.value.up = true
          keyStates.value.right = true
          break
        case 2: // Up (90°)
          keyStates.value.up = true
          break
        case 3: // Up-Left (135°)
          keyStates.value.up = true
          keyStates.value.left = true
          break
        case 4: // Left (180°)
          keyStates.value.left = true
          break
        case 5: // Down-Left (225°)
          keyStates.value.down = true
          keyStates.value.left = true
          break
        case 6: // Down (270°)
          keyStates.value.down = true
          break
        case 7: // Down-Right (315°)
          keyStates.value.down = true
          keyStates.value.right = true
          break
      }
    } else {
      // Reset all directions if in dead zone
      keyStates.value.up = false
      keyStates.value.down = false
      keyStates.value.left = false
      keyStates.value.right = false
    }
  }

  const resetMovement = () => {
    keyStates.value.up = false
    keyStates.value.down = false
    keyStates.value.left = false
    keyStates.value.right = false
    trackpadPosition.value = { left: '50%', top: '50%' }
  }

  return {
    keyStates,
    handleKeyDown,
    handleKeyUp,
    isMobileDevice,
    trackpadPosition,
    handleTrackpadTouch,
    resetMovement,
    showMusicControls
  }
} 