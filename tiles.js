
define(['crafty', 'constants'], function (Crafty, k) {

  Crafty.c('Tile', {
    required: '2D, Color, Canvas', 
    init: function () {
      this.attr({
          w: k.tile.width,
          h: k.tile.height,
        });
    },
  });

  Crafty.c('ImpassableTile', {
    required: 'Tile, Collision',
    init: function () {
      this.collision();
      if (k.debug) {
        this.addComponent('WiredHitBox');
      }
    },
  });

  Crafty.c('Wall', {
    required: 'ImpassableTile',
    init: function () {
      this.color("#555555");
    },
  });

  Crafty.c('Floor', {
    required: 'Tile',
    init: function () {
      this.color("#cccccc");
    },
  });
});
