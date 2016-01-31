/*
 * Enemies!
 */
define(['crafty', 'constants', 'util/center', 'util/health'], function (Crafty, k) {

  Crafty.sprite(
    40, 68, 'assets/Sprites/enemies.png',
    {
      'PoliceSprite': [0, 0],
      'BruteSprite': [1, 0],
      'FemaleSprite': [2, 0],
    });

  Crafty.c('Enemy', {
    required: '2D, Canvas, Health, Motion, Collision, Center',
    init: function () {
      this.attr({
        z: k.layers.enemies,
      });
    },
  });

  Crafty.c("Police", {
    required: 'Enemy, PoliceSprite',
    init: function () {
      this.attr({
          w: 34,
          h: 68,
        })
        .collision();
    },
  });

  Crafty.c("Brute", {
    required: 'Enemy, BruteSprite',
    init: function () {
      this.attr({
          w: 38,
          h: 64,
        })
        .collision();
    },
  });

  Crafty.c("Female", {
    required: 'Enemy, FemaleSprite',
    init: function () {
      this.attr({
          w: 24,
          h: 60,
        })
        .collision();
    },
  });
});
