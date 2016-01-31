/*
 * Enemies!
 */
define(['crafty', 'constants', 'util/center', 'util/health'], function (Crafty, k) {

  Crafty.sprite(
    20, 34, 'assets/Sprites/enemies.png',
    {
      'PoliceSprite': [0, 0],
      'BruteSprite': [1, 0],
      'FemaleSprite': [2, 0],
    });

  Crafty.c('Enemy', {
    required: '2D, Canvas, Health, Collision, Center',
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
        w: 17,
        h: 34,
      });
    },
  });

  Crafty.c("Brute", {
    required: 'Enemy, BruteSprite',
    init: function () {
      this.attr({
        w: 19,
        h: 32,
      });
    },
  });

  Crafty.c("Female", {
    required: 'Enemy, FemaleSprite',
    init: function () {
      this.attr({
        w: 12,
        h: 30,
      });
    },
  });
});
