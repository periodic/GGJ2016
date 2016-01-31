/*
 * Global constants and stuff that define how the game works.
 */
define({
  debug: false,

  canvasWidthPx: 640,
  canvasHeightPx: 480,

  player: {
    width: 30,
    height: 30,
    speed: 200,
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
  },

  bullet: {
    speed: 600,
    maxDistance: 1000,
  },

  tile: {
    width: 40,
    height: 40,
  },

  room: {
    width: 13,
    height: 13,
  },

  map: {
    width: 4,
    height: 4,
    connectedness: 0.5,
  },

  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});
