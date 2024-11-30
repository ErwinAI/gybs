export const levels = {
  1: {
    up: { x: 18, y: 18 },
    collectibles: [[10, 7], [10, 13]],
    obstacles: {
      type: 'windmill',
      center: [10, 10],
      size: 5,
      rotationSteps: 32,
      animationSpeed: 800
    },
    spawnPoint: { x: 1, y: 1 }
  },
  2: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[6, 10], [14, 10]],
    obstacles: {
      type: 'bouncingBalls',
      center: [10, 10],
      size: 7,
      rotationSteps: 64,
      animationSpeed: 50
    }
  },
  3: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[8, 8], [12, 12], [8, 12], [12, 8]],
    obstacles: {
      type: 'phasingWall',
      center: [10, 10],
      size: 8,
      rotationSteps: 16,
      animationSpeed: 200
    }
  },
  4: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[5, 10], [15, 10], [10, 5], [10, 15]],
    obstacles: {
      type: 'cross',
      center: [10, 10],
      size: 5,
      rotationSteps: 32,
      animationSpeed: 300
    }
  },
  5: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[7, 7], [13, 13]],
    obstacles: [
      {
        type: 'orbitingDots',
        center: [13, 13],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 300
      },
      {
        type: 'orbitingDots',
        center: [7, 7],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 300
      },
      {
        type: 'orbitingDots',
        center: [14, 6],
        size: 6,
        rotationSteps: 32,
        animationSpeed: 300
      },
      {
        type: 'orbitingDots',
        center: [6, 14],
        size: 6,
        rotationSteps: 32,
        animationSpeed: 300
      }
    ]
  },
  6: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[5, 10], [15, 10], [10, 10]],
    obstacles: [
      {
        type: 'alternatingWall',
        center: [10, 10],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 150
      }
    ]
  },
  7: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[5, 15], [15, 5], [10, 10]],
    obstacles: [
      {
        type: 'cross',
        center: [7, 7],
        size: 7,
        rotationSteps: 32,
        animationSpeed: 250
      },
      {
        type: 'bouncingBalls',
        center: [13, 13],
        size: 8,
        rotationSteps: 64,
        animationSpeed: 50
      }
    ]
  },
  8: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[7, 7], [13, 7], [10, 13]],
    obstacles: [
      {
        type: 'windmill',
        center: [10, 10],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'alternatingWall',
        center: [10, 5],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 150
      }
    ]
  },
  9: {
    up: { x: 18, y: 18 },
    down: { x: 1, y: 1 },
    collectibles: [[5, 5], [15, 5], [10, 15]],
    obstacles: [
      {
        type: 'zipper',
        center: [10, 7],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 150
      },
      {
        type: 'bouncingBalls',
        center: [10, 13],
        size: 9,
        rotationSteps: 64,
        animationSpeed: 50
      }
    ]
  },
  10: {
    down: { x: 1, y: 1 },
    collectibles: [[7, 7], [13, 7], [7, 13], [13, 13], [10, 10]],
    up: { x: 18, y: 18 },
    obstacles: [
      {
        type: 'cross',
        center: [10, 10],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'alternatingWall',
        center: [10, 15],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 100
      }
    ]
  }
} 