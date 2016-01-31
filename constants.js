/*
 * Global constants and stuff that define how the game works.
 */
define({
  debug: true,

  canvasWidthPx: 800,
  canvasHeightPx: 600,

  player: {
    width: 96,
    height: 64,
    speed: 200,
    maxHealth: 100,
    fireRate: 0.5,
    collision: {
      xMin: 26,
      xMax: 70,
      yMin: 10,
      yMax: 54,
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
    width: 64,
    height: 64,
  },

  room: {
    width: 19,
    height: 19,
  },

  map: {
    rows: 10,
    columns: 4,
    originR: 0,
    originC: 0,
    exitR: 9,
    exitC: 3,
    connectedness: 0.2,
  },

  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});
