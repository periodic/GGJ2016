/*
 * Global constants and stuff that define how the game works.
 */
define({
  debug: true,

  canvasWidthPx: 800,
  canvasHeightPx: 600,

  player: {
    width: 48,
    height: 32,
    speed: 200,
    maxHealth: 100,
    fireRate: 0.5,
    collision: {
      xMin:13,
      xMax: 35,
      yMin: 5,
      yMax: 27,
    },
    healthBar: {
      x: 10,
      y: 10,
      w: 200,
      h: 20,
      color: 'green',
    },
  },

  gun: {
    width: 15,
    height: 5,
    offsetX: 30,
    offsetY: 10,
  },

  layers: {
    background: 1,
    obstacles: 2,
    enemies: 3,
    gun: 4,
    player: 5,
    bullets: 6,
    ui: 7,
  },

  bullet: {
    speed: 600,
    maxDistance: 1000,
  },

  tile: {
    width: 32,
    height: 32,
  },

  room: {
    width: 15,
    height: 15,
    spriteWidth: 480,
    spriteHeight: 480,
  },

  map: {
    rows: 10,
    columns: 4,
    originR: 0,
    originC: 0,
    exitR: 9,
    exitC: 3,
    connectedness: 0.4,
  },

  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});
