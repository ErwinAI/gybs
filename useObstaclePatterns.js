const startAnimation = (pattern) => {
  currentStep.value = 0
  isAnimating.value = true
  const frameDelay = Math.max(pattern.animationSpeed || 500, 1000 / 60)
  animationInterval = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % pattern.rotationSteps
  }, frameDelay)
} 