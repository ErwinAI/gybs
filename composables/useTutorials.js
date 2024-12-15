import { ref } from 'vue'

const tutorials = {
  start: {
    title: "Bl0cks",
    subtitle: "Do not play, extremely addictive",
    content: [
      "This is you - move with WASD or Arrow Keys",
      "Collect yellow bl0cks called g0ld",
      "Avoid deadly red bl0cks",
      "Blue portals take you up a level",
      "Green portals take you down a level"
    ],
    showBefore: 1,
    useColoredBullets: true
  },
  score: {
    title: "Score",
    content: [
      "Your score is displayed at the top of the screen",
      "Collect g0ld to increase your score by 10",
      "Hitting red bl0cks decreases your score by 5"
    ],
    showBefore: 2,
    useColoredBullets: false
  },
  diagonalMovement: {
    title: "Diagonal Movement",
    content: [
      "You can move diagonally!",
      "Press two direction keys at once",
      "For example: Up + Right to move diagonally"
    ],
    showBefore: 3,
    useColoredBullets: false
  },
  speed: {
    title: "New Ability Unlocked!",
    content: [
      "Things are getting tougher, so here's a new ability!",
      "Hold SHIFT while moving to run faster",
      "Be careful though - speed kills!"
    ],
    showBefore: 5,
    useColoredBullets: false
  },
  goldGemsTip: {
    title: "Reminder",
    content: [
      "G0ld are worth 10 points each",
      "You don't have to collect them all, just fyi"
    ],
    showBefore: 8,
    useColoredBullets: false
  },
  portalTips: {
    title: "Secret levels and enemies!",
    content: [
      "Green portals take you down to secret levels",
      "We're introducing z0z to the game, they're enemy blocks!",
      "Secret levels are challenging, but they have more g0ld!"
    ],
    showBefore: 11,
    useColoredBullets: false
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