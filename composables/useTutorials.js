import { ref } from 'vue'

const tutorials = {
  start: {
    title: "Bl0cks",
    subtitle: "Do not play, extremely addictive",
    content: [
      "This is you - move with WASD or Arrow Keys",
      "Collect these yellow gems for points",
      "Avoid these deadly red obstacles",
      "Blue portals take you up a level",
      "Green portals take you down a level"
    ],
    showBefore: 1
  },
  speed: {
    title: "New Ability Unlocked!",
    content: [
      "Things are getting tougher!",
      "Hold SHIFT while moving to run faster",
      "Be careful though - speed kills!"
    ],
    showBefore: 6
  }
}

export function useTutorials() {
  const currentTutorial = ref(null)
  const showTutorial = ref(false)

  const checkForTutorial = (level) => {
    const tutorial = Object.values(tutorials).find(t => t.showBefore === level)
    if (tutorial) {
      currentTutorial.value = tutorial
      showTutorial.value = true
      return true
    }
    return false
  }

  const closeTutorial = () => {
    showTutorial.value = false
    currentTutorial.value = null
  }

  return {
    currentTutorial,
    showTutorial,
    checkForTutorial,
    closeTutorial
  }
} 