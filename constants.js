/*
 * Global constants and stuff that define how the game works.
 */
define({
  debug: false,

  canvasWidthPx: 800,
  canvasHeightPx: 600,

  player: {
    width: 106,
    height: 64,
    speed: 250,
    maxHealth: 100,
    knockbackDuration: 300,
    collision: {
      xMin: 26,
      xMax: 80,
      yMin: 15,
      yMax: 64,
    },
    healthBar: {
      x: 10,
      y: 10,
      w: 200,
      h: 20,
      color: 'green',
    },
    fireRate: 0.5,
    bulletSpeed: 600,
    bulletDamage: 30,
  },

  enemy: {
    aiUpdateRate: 500,
    aiResponseDistance: 64 * 19, // size of a room.
    meanderSpeed: 30,
    meanderDirectionChangeChance: 0.1,
    perRoom: 2,
    police: {
      maxHealth: 40,
      speed: 110,
      fireRate: 1,
      bulletSpeed: 300,
      bulletDamage: 25,
      preferredDistance: 300,
    },
    brute: {
      maxHealth: 200,
      speed: 150,
      meleeDamage: 20,
      knockbackDistance: 2 * 64, // 2 tiles.
    },
    female: {
      maxHealth: 80,
      speed: 120,
      fireRate: 1,
      bulletSpeed: 400,
      bulletDamage: 15,
    },
  },

  gun: {
    offset: 60,
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
    rows: 4,
    columns: 4,
    originR: 0,
    originC: 0,
    exitR: 3,
    exitC: 3,
    connectedness: 0.2,
  },

  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});
