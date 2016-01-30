/*
 * Global constants and stuff that define how the game works.
 */
define({
  canvasWidthPx: 640,
  canvasHeightPx: 480,



  characterWidth: 40,
  characterHeight: 40,
  characterSpeed: 100,
  characterCollision: {
    xMin: 0,
    ymin: 0,
    xMax: 40,
    yMax: 40,
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
    speed: 200,
    maxDistance: 200,
  },

  tile: {
    width: 40,
    height: 40,
  },
});
