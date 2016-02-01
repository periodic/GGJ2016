/*
 * Global constants and stuff that define how the game works.
 */
define(['crafty', 'constants', 'util/center'], function (Crafty, k) {
  Crafty.sprite(
    'assets/Sprites/starting-circle.png',
    {
      'StartingCircleSprite': [0, 0, 112, 112],
    });

  Crafty.sprite(
    'assets/Sprites/ritual-circle.png',
    {
      'EndingCircleSprite': [0, 0, 112, 112],
    });

  Crafty.c('Circle', {
    required: '2D, Canvas, Center',
    init: function () {
      this.attr({
        w: 112,
        h: 112,
        z: k.layers.decals,
      });
    },
  });

  Crafty.c('StartingCircle', {
    required: 'Circle, StartingCircleSprite',
  });

  Crafty.c('EndingCircle', {
    required: 'Circle, EndingCircleSprite, Collision, Delay',
    init: function () {
      this.collision(
        50, 50,
        50, 62,
        62, 62,
        62, 50)
        .checkHits('Player');
    },
    events: {
      HitOn: function (hitData) {
        var enemiesPresent = Crafty.map.search({
          _x: this.x - 10 * k.tile.width,
          _y: this.y - 10 * k.tile.height,
          _w: k.room.width * k.tile.width,
          _h: k.room.height * k.tile.height,
        }).some(function (ent) {
          return ent.has('Enemy');
        });
        console.log("Enemies present? ", enemiesPresent);
        if (!enemiesPresent) {
          Crafty.scene('Victory');
        }
        this.delay(this.resetHitChecks, 200);
      },
    },
  });

});
