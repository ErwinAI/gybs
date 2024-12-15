export const levels = {
  1: {
    nextLevel: 2,
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
    nextLevel: 3,
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
    nextLevel: 4,
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
    nextLevel: 5,
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
    nextLevel: 6,
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
    nextLevel: 7,
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
    nextLevel: 8,
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
    nextLevel: 9,
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
    nextLevel: 10,
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
    nextLevel: 11,
    up: { x: 18, y: 18 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[7, 7], [13, 7], [7, 13], [13, 13], [2, 17], [8, 17]],
    obstacles: [
      {
        type: 'cross',
        center: [10, 10],
        size: 7,
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
  },
  11: {
    nextLevel: 12,
    hiddenLevel: "11b",
    up: { x: 18, y: 18 },
    down: { x: 18, y: 1 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[10, 10], [18, 2], [7, 16], [17, 17]],
    walls: [
      [17, 0], [18, 0], [19, 0], [17, 1], [17, 2], [19, 2], [19, 1]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [7, 13],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 150
      },
      {
        type: 'windmill',
        center: [13, 7],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 150
      }
    ],
    enemies: [
      {
        type: 'patroller',
        x: 16,
        y: 0,
        path: [
          [16, 0], [16, 1], [16, 2], [16, 3],  // Down
          [17, 3], [18, 3], [19, 3]            // Right
        ],
        animationSpeed: 300
      }
    ]
  },
  "11b": {
    returnLevel: 11,
    up: { x: 14, y: 14 },
    spawnPoint: { x: 5, y: 5 },
    collectibles: [[3, 3], [16, 3], [3, 16], [16, 16], [9, 9]],
    walls: [
      // Top wall
      [2, 2], [3, 2], [4, 2], [15, 2], [16, 2], [17, 2],
      // Bottom wall  
      [2, 17], [3, 17], [4, 17], [15, 17], [16, 17], [17, 17],
      // Left wall
      [2, 3], [2, 4], [2, 15], [2, 16],
      // Right wall
      [17, 3], [17, 4], [17, 15], [17, 16],
      // Center maze pieces
      [8, 8], [9, 8], [10, 8], [11, 8],
      [8, 11], [9, 11], [10, 11], [11, 11]
    ],
    enemies: [
      {
        type: 'patroller',
        x: 3,
        y: 4,
        path: [[3, 4], [4, 4], [4, 3], [3, 3]], // Top left patrol
        animationSpeed: 300
      },
      {
        type: 'patroller',
        x: 15,
        y: 4,
        path: [[15, 4], [16, 4], [16, 3], [15, 3]], // Top right patrol
        animationSpeed: 300
      },
      {
        type: 'patroller',
        x: 3,
        y: 15,
        path: [[3, 15], [4, 15], [4, 16], [3, 16]], // Bottom left patrol
        animationSpeed: 300
      },
      {
        type: 'patroller',
        x: 15,
        y: 15,
        path: [[15, 15], [16, 15], [16, 16], [15, 16]], // Bottom right patrol
        animationSpeed: 300
      },
      {
        type: 'patroller',
        x: 8,
        y: 9,
        path: [[8, 9], [9, 9], [10, 9], [11, 9], [11, 10], [10, 10], [9, 10], [8, 10]], // Middle maze patrol
        animationSpeed: 300
      }
    ]
  },
  12: {
    nextLevel: 13,
    hiddenLevel: "12b",
    up: { x: 18, y: 18 },
    down: { x: 15, y: 15 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[3, 16], [16, 3], [8, 8], [12, 12]],
    walls: [
      // Create connected maze-like structure
      [5, 5], [6, 5], [8, 5], [9, 5],     // Top horizontal wall
      [5, 6], [5, 7], [5, 8], [5, 9],             // Left vertical wall
      [6, 9], [7, 9], [8, 9], [9, 9],             // Bottom horizontal wall
      [9, 6], [9, 7], [9, 8],                     // Right vertical wall
      
      [13, 13], [13, 14], [14, 13], [14, 14],     // Down portal protection
      [15, 13], [13, 15],                         // Extra protection
      
      [2, 15], [2, 16], [2, 17], [3, 15],         // Bottom-left section
      [15, 2], [16, 2], [17, 2], [15, 3],         // Top-right section
      
      [11, 7], [12, 7], [13, 7],                  // Additional barriers
      [7, 11], [7, 12], [7, 13]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [10, 10],
        size: 5,  // Increased size
        rotationSteps: 32,
        animationSpeed: 200
      }
    ],
    enemies: [
      {
        type: 'hunter',
        x: 8,
        y: 8,
        animationSpeed: 250  // Even faster
      },
      {
        type: 'patroller',
        x: 3,
        y: 15,
        path: [
          [3, 15], [3, 16], [3, 17], [4, 17], [4, 16], [4, 15]
        ],
        animationSpeed: 200
      },
      {
        type: 'patroller',
        x: 15,
        y: 3,
        path: [
          [15, 3], [15, 4], [16, 4], [16, 3]
        ],
        animationSpeed: 200
      }
    ]
  },
  "12b": {
    returnLevel: 12,
    up: { x: 2, y: 2 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[17, 17], [17, 3], [3, 17], [10, 10], [5, 15], [14, 4]], // Spread throughout maze
    walls: [
      // Outer walls
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0],
      [0, 18], [1, 18], [2, 18], [3, 18], [4, 18], [5, 18], [6, 18], [7, 18], [8, 18], [9, 18], [10, 18], [11, 18], [12, 18], [13, 18], [14, 18], [15, 18], [16, 18], [17, 18], [18, 18],
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17],
      [18, 1], [18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13], [18, 14], [18, 15], [18, 16], [18, 17],
      
      // Maze internal walls
      // Left section
      [4, 4], [5, 4], [6, 4], [7, 4],
      [4, 5], [4, 6], [4, 7],
      [5, 7], [6, 7], [7, 7],
      
      // Middle section
      [9, 2], [9, 3], [9, 4], [9, 5], [9, 6],
      [10, 6], [11, 6], [12, 6],
      [12, 7], [12, 8], [12, 9],
      [9, 9], [10, 9], [11, 9],
      
      // Right section
      [14, 4], [15, 4], [16, 4],
      [14, 5], [14, 6], [14, 7],
      [14, 8], [15, 8], [16, 8],
      
      // Bottom section
      [4, 12], [5, 12], [6, 12], [7, 12],
      [7, 13], [7, 14], [7, 15],
      [8, 15], [9, 15], [10, 15],
      [12, 12], [13, 12], [14, 12],
      [12, 13], [12, 14], [12, 15]
    ],
    enemies: [
      {
        type: 'hunter',
        x: 4,
        y: 3,
        animationSpeed: 200
      },
      {
        type: 'patroller',
        x: 8,
        y: 8,
        // Patrols the center area
        path: [
          [8, 8], [8, 9], [8, 10], [9, 10], [10, 10], [10, 9], [10, 8], [9, 8]
        ],
        animationSpeed: 200
      },
      {
        type: 'patroller',
        x: 15,
        y: 5,
        // Patrols right section
        path: [
          [15, 5], [15, 6], [15, 7], [16, 7], [16, 6], [16, 5]
        ],
        animationSpeed: 200
      }
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [6, 14],
        size: 3,
        rotationSteps: 32,
        animationSpeed: 150
      }
    ]
  },
  13: {
    nextLevel: 14,
    hiddenLevel: "13b",
    up: { x: 18, y: 18 },
    down: { x: 2, y: 16 },
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[2, 2], [17, 2], [12, 12], [17, 17]],
    walls: [
      // Chamber walls with opening
      [1, 15], [1, 17], [2, 15], [3, 15], [3, 16], [3, 17], [2, 17]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [10, 10],
        size: 6,
        rotationSteps: 32,
        animationSpeed: 150
      },
      {
        type: 'bouncingBalls',
        center: [3, 17],
        size: 4,
        rotationSteps: 32,
        animationSpeed: 100
      },
      {
        type: 'bouncingBalls', 
        center: [17, 3],
        size: 4,
        rotationSteps: 32,
        animationSpeed: 100
      }
    ]
  },
  "13b": {
    returnLevel: 13,
    up: { x: 16, y: 2 },
    spawnPoint: { x: 16, y: 2 },
    collectibles: [[15, 15], [17, 1], [4, 4], [10, 8]], // Spread across corners and middle
    walls: [
      // Maze internal walls - creating a spiral-like pattern with multiple paths
      // Central structure
      [8, 4], [11, 4],
      [8, 5], [8, 6], [8, 7], [8, 8],
      [8, 9], [9, 9], [10, 9], [11, 9],
      [11, 5], [11, 6], [11, 7], [11, 8],
      
      // Left wing
      [3, 3], [4, 3], [5, 3],
      [3, 4], [3, 5], [3, 6],
      [4, 6], [5, 6], [6, 6],
      
      // Right wing
      [14, 3], [15, 3], [16, 3],
      [14, 4], [14, 5], [14, 6],
      [14, 7], [15, 7], [16, 7],
      
      // Bottom section
      [3, 12], [4, 12], [5, 12], [6, 12],
      [6, 13], [6, 14], [6, 15],
      [7, 15], [8, 15], [9, 15],
      
      // Additional barriers
      [12, 12], [13, 12], [14, 12],
      [12, 13], [12, 14], [12, 15]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [5, 9],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 200
      },
      {
        type: 'windmill',
        center: [17, 11],
        size: 6,
        rotationSteps: 32,
        animationSpeed: 200
      }
    ]
  },
  14: {
    nextLevel: 15,
    hiddenLevel: "14b",
    up: { x: 18, y: 18 },
    down: { x: 9, y: 9 },
    spawnPoint: { x: 0, y: 0 },
    collectibles: [[2, 9], [16, 9], [9, 2], [9, 16]], // Safe spots away from obstacles
    walls: [
      // Center chamber walls with opening
      [8, 8], [8, 10], [9, 8], [10, 8], [10, 9], [10, 10]
    ],
    obstacles: [
      {
        type: 'alternatingWall',
        center: [9, 5],
        size: 6,
        rotationSteps: 32,
        animationSpeed: 150
      },
      {
        type: 'zipper',
        center: [9, 15],
        size: 8,
        rotationSteps: 32,
        animationSpeed: 100
      },
      {
        type: 'orbitingDots',
        center: [15, 9],
        size: 4,
        rotationSteps: 32,
        animationSpeed: 120
      }
    ]
  },
  "14b": {
    returnLevel: 14,
    up: { x: 9, y: 4 },
    spawnPoint: { x: 9, y: 4 },
    collectibles: [[3, 3], [15, 3], [3, 15], [15, 15], [9, 16]],
    walls: [
      // Corner sections
      [2, 2], [3, 2], [4, 2],
      [2, 3], [2, 4],
      
      [15, 2], [16, 2], [17, 2],
      [17, 3], [17, 4],
      
      [2, 15], [2, 16], [2, 17],
      [3, 17], [4, 17],
      
      [15, 17], [16, 17], [17, 17],
      [17, 15], [17, 16],
      
      // Some strategic middle barriers
      [7, 7], [8, 7], [10, 7], [11, 7],
      [7, 11], [8, 11], [10, 11],
      
      // Protection around portal
      [8, 1], [10, 1],
      [8, 3], [10, 3]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [9, 0],
        size: 7,
        rotationSteps: 32,
        animationSpeed: 120
      }
    ],
    enemies: [
      {
        type: 'stepHunter',  // First step hunter
        x: 15,
        y: 15,
        animationSpeed: 50
      },
      {
        type: 'stepHunter',  // Second step hunter
        x: 3,
        y: 15,
        animationSpeed: 50
      }
    ]
  },
  15: {
    nextLevel: "victory",
    hiddenLevels: ["15b", "15c"],
    up: { x: 18, y: 18 },
    down: [{ x: 3, y: 5 }, { x: 15, y: 13 }],
    spawnPoint: { x: 1, y: 1 },
    collectibles: [[1, 1], [18, 1], [1, 18], [17, 17]],
    walls: [
      // First chamber walls with opening (moved to match new portal position)
      [2, 4], [2, 6], [3, 4], [4, 4], [4, 5], [4, 6],
      // Second chamber walls with opening (moved to match new portal position)
      [14, 12], [14, 14], [15, 12], [16, 12], [16, 13], [16, 14]
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [10, 10],
        size: 7,
        rotationSteps: 32,
        animationSpeed: 120
      },
      {
        type: 'bouncingBalls',
        center: [5, 15],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 100
      },
      {
        type: 'zipper',
        center: [15, 5],
        size: 5,
        rotationSteps: 32,
        animationSpeed: 150
      },
      {
        type: 'orbitingDots',
        center: [10, 10],
        size: 4,
        rotationSteps: 32,
        animationSpeed: 120
      }
    ]
  },
  "15b": {
    returnLevel: 15,
    up: { x: 3, y: 3 },
    spawnPoint: { x: 6, y: 6 },
    collectibles: [
      [2, 2], [16, 16], [16, 2], [2, 16]
    ],
    walls: [
      // Outer maze structure
      [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5],
      [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13], [11, 13], [12, 13], [13, 13],
      [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12],
      [13, 6], [13, 7], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12],
      
      // Corner protections
      [1, 2], [2, 1],
      [15, 1], [16, 1], [17, 1],
      [1, 15], [1, 16], [1, 17],
      [15, 15], [15, 16], [16, 15]
    ],
    enemies: [
      {
        type: 'hunter',
        x: 15,
        y: 15,
        animationSpeed: 400
      },
      {
        type: 'hunter',
        x: 15,
        y: 3,
        animationSpeed: 400
      }
    ],
    obstacles: [
      {
        type: 'windmill',
        center: [9, 9],
        size: 8,
        rotationSteps: 64,
        animationSpeed: 300
      }
    ]
  },
  "15c": {
    returnLevel: 15,
    up: { x: 19, y: 19 },
    spawnPoint: { x: 3, y: 3 },
    collectibles: [
      [5, 5], [15, 5], [5, 15], [15, 15]
    ],
    walls: [
      // More tactical wall placement - creating corridors and choke points
      // Center cross
      [8, 8], [9, 8], [10, 8], [11, 8],
      [8, 11], [9, 11], [10, 11], [11, 11],
      [8, 9], [8, 10],
      [11, 9], [11, 10],
      
      // Corner protections
      [2, 2], [3, 2], [2, 3],
      [15, 2], [16, 2], [16, 3],
      [2, 15], [2, 16], [3, 16],
      [14, 14], [14, 15], [15, 14],
      
      // Strategic barriers
      [6, 6], [12, 6],
      [6, 12], [12, 12],
      [4, 8], [14, 8],
      [8, 4], [8, 14]
    ],
    enemies: [
      {
        type: 'stepHunter',
        x: 16,
        y: 16,
        animationSpeed: 50
      },
      {
        type: 'stepHunter',
        x: 16,
        y: 2,
        animationSpeed: 50
      },
      {
        type: 'stepHunter',
        x: 2,
        y: 16,
        animationSpeed: 50
      }
    ],
    obstacles: [
      {
        type: 'bouncingBalls',
        center: [3, 3],
        size: 3,
        rotationSteps: 16,
        animationSpeed: 80
      },
      {
        type: 'bouncingBalls',
        center: [16, 3],
        size: 3,
        rotationSteps: 16,
        animationSpeed: 80
      },
      {
        type: 'bouncingBalls',
        center: [3, 16],
        size: 3,
        rotationSteps: 16,
        animationSpeed: 80
      },
    ]
  }
} 