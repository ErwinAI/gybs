import { ref, computed } from 'vue'

export function useObstaclePatterns() {
  const currentStep = ref(0)
  const isAnimating = ref(false)
  let animationInterval = null

  const generatePlusPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate the plus shape
    for (let i = -size; i <= size; i++) {
      // Horizontal line
      points.push(rotatePoint(cx, cy, cx + i, cy, cos, sin))
      // Vertical line
      points.push(rotatePoint(cx, cy, cx, cy + i, cos, sin))
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateSquaresPattern = (centers, size, step, steps) => {
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    centers.forEach(([cx, cy]) => {
      // Generate each 3x3 square
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const [rx, ry] = rotatePoint(cx, cy, cx + dx, cy + dy, cos, sin)
          points.push({ x: Math.round(rx), y: Math.round(ry) })
        }
      }
    })
    
    return points
  }

  const rotatePoint = (cx, cy, px, py, cos, sin) => {
    const dx = px - cx
    const dy = py - cy
    return [
      cx + dx * cos - dy * sin,
      cy + dx * sin + dy * cos
    ]
  }

  const generateWindmillPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate four connected arms
    for (let arm = 0; arm < 4; arm++) {
      const armAngle = (arm * Math.PI / 2) + angle
      for (let i = 0; i <= size; i++) { // Start from center (0) to ensure connection
        const px = cx + i * Math.cos(armAngle)
        const py = cy + i * Math.sin(armAngle)
        points.push([px, py])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateZigzagPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate connected zigzag pattern
    for (let i = -size; i <= size; i++) {
      const offset = Math.floor(i / 2) % 2 === 0 ? 1 : -1
      points.push(rotatePoint(cx, cy, cx + i, cy + offset, cos, sin))
      // Add connecting tiles
      if (i < size) {
        points.push(rotatePoint(cx, cy, cx + i + 0.5, cy + offset * 0.5, cos, sin))
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateSpiralPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate connected spiral
    for (let i = 0; i <= size * 8; i++) {
      const spiralAngle = (i * 0.25) + angle
      const radius = i * 0.25
      const px = cx + radius * Math.cos(spiralAngle)
      const py = cy + radius * Math.sin(spiralAngle)
      points.push([px, py])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateStarburstPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate connected starburst with 5 arms
    for (let arm = 0; arm < 5; arm++) {
      const armAngle = (arm * 2 * Math.PI / 5) + angle
      // Draw from center out
      for (let i = 0; i <= size; i += 0.5) { // Smaller steps for better connection
        const px = cx + i * Math.cos(armAngle)
        const py = cy + i * Math.sin(armAngle)
        points.push([px, py])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateWavePattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate connected wave pattern
    for (let i = -size; i <= size; i += 0.5) { // Smaller steps for better connection
      const waveHeight = Math.sin((i * Math.PI / size) + angle) * 2
      points.push(rotatePoint(cx, cy, cx + i, cy + waveHeight, cos, sin))
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateCrossPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate X shape
    for (let i = -size; i <= size; i += 0.5) {
      points.push(rotatePoint(cx, cy, cx + i, cy + i, cos, sin))
      points.push(rotatePoint(cx, cy, cx + i, cy - i, cos, sin))
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateSnakePattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate snake pattern with 4 openings
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      // Create 4 gaps in the pattern
      const gapSize = 0.3 // Size of the gaps
      const isGap = (t + angle) % (Math.PI / 2) < gapSize // Creates 4 evenly spaced gaps
      
      if (!isGap) {
        // Create a snake-like pattern using sine waves
        const radius = size * (1 + 0.3 * Math.sin(3 * t)) // Varying radius creates snake-like shape
        const x = cx + radius * Math.cos(t + angle)
        const y = cy + radius * Math.sin(t + angle)
        points.push([x, y])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateTrianglePattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate V-shape (triangle with open top)
    for (let i = 0; i <= 2; i++) {
      const t = (i / 2) * 2 * Math.PI  // Only go 2/3 of the way around
      const px1 = cx + size * Math.cos(t + angle)
      const py1 = cy + size * Math.sin(t + angle)
      
      if (i < 2) {  // Only draw 2 sides
        const px2 = cx + size * Math.cos(t + angle + Math.PI / 1.5)  // Adjusted angle for V-shape
        const py2 = cy + size * Math.sin(t + angle + Math.PI / 1.5)
        
        // Draw line between points
        const dx = px2 - px1
        const dy = py2 - py1
        const steps = Math.max(Math.abs(dx), Math.abs(dy))
        for (let j = 0; j <= steps; j++) {
          points.push([
            px1 + (dx * j) / steps,
            py1 + (dy * j) / steps
          ])
        }
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateFigureEightPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate figure 8 pattern
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      const px = cx + size * Math.sin(t + angle)
      const py = cy + size * Math.sin(2 * t + angle)
      points.push([px, py])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generatePentagonPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate rotating pentagon outline
    for (let i = 0; i <= 5; i++) {
      const t = (i / 5) * 2 * Math.PI
      const px1 = cx + size * Math.cos(t + angle)
      const py1 = cy + size * Math.sin(t + angle)
      const px2 = cx + size * Math.cos(t + angle + 2 * Math.PI / 5)
      const py2 = cy + size * Math.sin(t + angle + 2 * Math.PI / 5)
      
      // Draw line between points
      const dx = px2 - px1
      const dy = py2 - py1
      const steps = Math.max(Math.abs(dx), Math.abs(dy))
      for (let j = 0; j <= steps; j++) {
        points.push([
          px1 + (dx * j) / steps,
          py1 + (dy * j) / steps
        ])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateSineWavePattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate sine wave with gaps
    for (let i = -size; i <= size; i += 0.5) {
      // Create gaps by skipping some points
      if (Math.abs(i) % 3 < 2) { // Creates periodic gaps
        const waveHeight = Math.sin((i * Math.PI / size) + angle) * 2
        points.push(rotatePoint(cx, cy, cx + i, cy + waveHeight, cos, sin))
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateDoubleHelixPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const points = []
    // Generate two intertwining waves
    for (let i = -size; i <= size; i += 0.5) {
      // First helix
      const wave1Height = Math.sin((i * Math.PI / size) + angle) * 2
      points.push(rotatePoint(cx, cy, cx + i, cy + wave1Height, cos, sin))
      
      // Second helix, offset by π
      const wave2Height = Math.sin((i * Math.PI / size) + angle + Math.PI) * 2
      points.push(rotatePoint(cx, cy, cx + i, cy + wave2Height, cos, sin))
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateSpirographPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Generate a spirograph-like pattern with gaps
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      // Skip points periodically to create gaps
      if (Math.floor(t * 5) % 2 === 0) {
        const R = size
        const r = size * 0.4
        const a = size * 0.4
        
        const x = cx + (R - r) * Math.cos(t) + a * Math.cos((R - r) * t / r + angle)
        const y = cy + (R - r) * Math.sin(t) + a * Math.sin((R - r) * t / r + angle)
        
        points.push([x, y])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateLissajousPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Generate Lissajous pattern with gaps
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      // Create periodic gaps
      if (Math.floor(t * 4) % 3 !== 0) {
        const x = cx + size * Math.sin(3 * t + angle)
        const y = cy + size * Math.sin(2 * t)
        points.push([x, y])
      }
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generatePhasingWallPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create a line of alternating up-down moving obstacles
    for (let i = -size; i <= size; i++) {
      const offset = Math.sin(angle + (i * Math.PI)) * 3 // Alternating motion
      points.push([cx + i, cy + offset])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateOrbitingDotsPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create 4 dots that orbit around the center at different radiuses
    for (let i = 0; i < 4; i++) {
      const orbitAngle = angle + (i * Math.PI / 2)
      const radius = 2 + i // Each dot has a different orbit radius
      const x = cx + radius * Math.cos(orbitAngle)
      const y = cy + radius * Math.sin(orbitAngle)
      points.push([x, y])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generatePulsingStarPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create 5 points that pulse in and out from center
    for (let i = 0; i < 5; i++) {
      const pointAngle = (i * 2 * Math.PI / 5) + angle
      const radius = 2 + Math.sin(angle) * 2 // Pulsing effect
      const x = cx + radius * Math.cos(pointAngle)
      const y = cy + radius * Math.sin(pointAngle)
      points.push([x, y])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateZipperPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create two rows of dots that move in opposite directions
    for (let i = -size; i <= size; i += 2) {
      const offset1 = Math.sin(angle + i) * 2
      const offset2 = Math.sin(angle + i + Math.PI) * 2
      points.push([cx + i, cy + offset1])
      points.push([cx + i, cy + offset2])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateBouncingBallsPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create a continuous wave of balls
    for (let i = -size; i <= size; i += 0.8) { // Reduced spacing between balls
      // Primary wave motion
      const baseHeight = Math.sin(angle + (i * 0.5)) * 2.5
      
      // Secondary wave for more organic motion
      const secondaryWave = Math.sin(angle * 0.5 + (i * 0.3)) * 0.5
      
      // Combine waves for final height
      const height = baseHeight + secondaryWave
      
      // Add slight horizontal drift for more fluid motion
      const horizontalDrift = Math.sin(angle * 0.25) * 0.3
      
      points.push([
        cx + i + horizontalDrift,
        cy + height
      ])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  const generateAlternatingWallPattern = (center, size, step, steps) => {
    const [cx, cy] = center
    const angle = (step / steps) * 2 * Math.PI
    
    const points = []
    // Create a line of blocks that move up/down with alternating phases
    for (let i = -size; i <= size; i++) {
      // Each block alternates its phase
      const phaseOffset = i % 2 === 0 ? 0 : Math.PI
      
      // Vertical motion with larger amplitude and alternating phases
      const verticalOffset = Math.sin(angle + phaseOffset) * 4
      
      // Add horizontal motion that switches direction based on vertical position
      const horizontalOffset = Math.cos(angle + phaseOffset)
      
      points.push([
        cx + i + horizontalOffset,
        cy + verticalOffset
      ])
    }
    
    return points.map(([x, y]) => ({ 
      x: Math.round(x), 
      y: Math.round(y) 
    }))
  }

  // Add memoization for pattern generation
  const patternCache = new Map()

  const generateObstacles = (pattern, step) => {
    if (pattern.type === 'staticWall') {
      return pattern.points.map(([x, y]) => ({ x, y }))
    }
    
    // Create cache key
    const cacheKey = `${pattern.type}-${pattern.center}-${pattern.size}-${step}-${pattern.rotationSteps}`
    
    // Check cache first
    if (patternCache.has(cacheKey)) {
      return patternCache.get(cacheKey)
    }
    
    let result = []
    switch (pattern.type) {
      case 'windmill':
        result = generateWindmillPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'triangle':
        result = generateTrianglePattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'cross':
        result = generateCrossPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'sineWave':
        result = generateSineWavePattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'phasingWall':
        result = generatePhasingWallPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'orbitingDots':
        result = generateOrbitingDotsPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'pulsingStar':
        result = generatePulsingStarPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'zipper':
        result = generateZipperPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'bouncingBalls':
        result = generateBouncingBallsPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      case 'alternatingWall':
        result = generateAlternatingWallPattern(pattern.center, pattern.size, step, pattern.rotationSteps)
        break
      default:
        return []
    }
    
    // Cache result (limit cache size to prevent memory issues)
    if (patternCache.size > 1000) {
      const firstKey = patternCache.keys().next().value
      patternCache.delete(firstKey)
    }
    patternCache.set(cacheKey, result)
    
    return result
  }

  const startAnimation = (pattern) => {
    currentStep.value = 0
    isAnimating.value = true
    animationInterval = setInterval(() => {
      currentStep.value = (currentStep.value + 1) % pattern.rotationSteps
    }, pattern.animationSpeed || 500)
  }

  const stopAnimation = () => {
    isAnimating.value = false
    clearInterval(animationInterval)
  }

  // Add this new pattern to the existing patterns
  const verticalSine = (obstacle, time) => {
    const { y: baseY, amplitude, speed, phase = 0 } = obstacle
    return {
      x: obstacle.x,
      y: baseY + Math.sin((time * speed / 1000) + phase) * amplitude
    }
  }

  // Add to patterns object
  const patterns = {
    // ... existing patterns
    verticalSine
  }

  return {
    currentStep,
    isAnimating,
    generateObstacles,
    startAnimation,
    stopAnimation
  }
} 