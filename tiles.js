
define(['crafty', 'constants'], function (Crafty, k) {

  Crafty.c('Tile', {
  });

  Crafty.c('Wall', {
    required: '2D, Color, Collision',
    init: function () {
      this.attr({
        w: k.tile.width,
        h: k.tile.height,

    },
  });
});
