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
    collectibles: [[6, 10], [14, 10]],
    obstacles: {
      type: 'bouncingBalls',
      center: [10, 10],
      size: 7,
      rotationSteps: 64,
      animationSpeed: 50
    },
    spawnPoint: { x: 1, y: 1 }
  },
  3: {
    up: { x: 18, y: 18 },
    collectibles: [[8, 8], [12, 12], [8, 12], [12, 8]],
    obstacles: {
      type: 'phasingWall',
      center: [10, 10],
      size: 8,
      rotationSteps: 16,
      animationSpeed: 200
    },
    spawnPoint: { x: 1, y: 1 }
  },
  4: {
    up: { x: 18, y: 18 },
    collectibles: [[5, 10], [15, 10], [10, 5], [10, 15]],
    obstacles: {
      type: 'cross',
      center: [10, 10],
      size: 5,
      rotationSteps: 32,
      animationSpeed: 200
    },
    spawnPoint: { x: 1, y: 1 }
  },
  5: {
    up: { x: 18, y: 18 },
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
    ],
    spawnPoint: { x: 1, y: 1 }
  },
  6: {
    up: { x: 18, y: 18 },
    collectibles: [[5, 10], [15, 10], [10, 10]],
    obstacles: [
      {
        type: 'alternatingWall',
        center: [10, 10],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 150
      }
    ],
    spawnPoint: { x: 1, y: 1 }
  },
  7: {
    up: { x: 18, y: 18 },
    collectibles: [[5, 15], [15, 5], [10, 10]],
    obstacles: [
      {
        type: 'cross',
        center: [8, 8],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 250
      },
      {
        type: 'bouncingBalls',
        center: [13, 13],
        size: 8,
        rotationSteps: 16,
        animationSpeed: 100
      }
    ],
    spawnPoint: { x: 1, y: 1 }
  },
  8: {
    up: { x: 18, y: 18 },
    collectibles: [[7, 7], [13, 7], [10, 13]],
    obstacles: [
      {
        type: 'alternatingWall',
        center: [9, 15],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'alternatingWall',
        center: [9, 6],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 200
      }
    ],
    spawnPoint: { x: 1, y: 1 }
  },
  9: {
    up: { x: 18, y: 18 },
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
        rotationSteps: 32,
        animationSpeed: 150
      }
    ],
    spawnPoint: { x: 1, y: 1 }
  },
  10: {
    collectibles: [[7, 7], [13, 7], [7, 13], [13, 13], [2, 17], [5, 17], [8, 17]],
    up: { x: 18, y: 18 },
    spawnPoint: { x: 1, y: 1 },
    obstacles: [
      {
        type: 'cross',
        center: [10, 10],
        size: 7,
        rotationSteps: 32,
        animationSpeed: 200
      }
      /*{
        type: 'alternatingWall',
        center: [10, 15],
        size: 9,
        rotationSteps: 32,
        animationSpeed: 100
      }*/
    ]
  },
  11: {
    up: [
      { x: 12, y: 12 },
      { x: 18, y: 18 }
    ],
    collectibles: [
      [9, 9], [9, 11],
      [11, 9], [11, 11],
      [10, 10]
    ],
    spawnPoint: { x: 1, y: 1 },
    walls: [
      [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7],
      [7, 13], [8, 13], [9, 13], [10, 13], [11, 13], [12, 13], [13, 13],
      [7, 8], [7, 9], [7, 10], [7, 11], [7, 12],
      [13, 8], [13, 9], [13, 10], [13, 11], [13, 12]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [10, 3],
        size: 4,
        rotationSteps: 32,
        animationSpeed: 400
      }
    ]
  },
  12: {
    down: [
      { x: 8, y: 8 },
    ],
    up: { x: 18, y: 18 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [],
    walls: [
      [7, 7], [8, 7], [9, 7], [11, 7], [12, 7], [13, 7],
      [7, 13], [8, 13], [9, 13], [11, 13], [12, 13], [13, 13],
      [7, 8], [7, 9], [7, 10], [7, 11], [7, 12],
      [13, 8], [13, 9], [13, 10], [13, 11], [13, 12]
    ],
    obstacles: [
      {
        type: 'cross',
        center: [4, 16],
        size: 3,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'cross',
        center: [16, 4],
        size: 3,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'cross',
        center: [16, 16],
        size: 3,
        rotationSteps: 32,
        animationSpeed: 200
      }
    ]
  }
} 