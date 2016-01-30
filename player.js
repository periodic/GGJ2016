/*
 * The player entity.
 */

define(['crafty', 'constants'], function (Crafty, k) {
  Crafty.c('Player', {
    init: function () {
      this.requires('2D, Canvas, Fourway, Collision, Color')
        .attr({
          w: k.characterWidth,
          h: k.characterHeight,
        })
        .color("red")
        .fourway(k.characterSpeed)
        .collision(
          [k.characterCollision.xMin, k.characterCollision.yMin],
          [k.characterCollision.xMin, k.characterCollision.yMax],
          [k.characterCollision.xMax, k.characterCollision.yMax],
          [k.characterCollision.xMax, k.characterCollision.yMin]);
    },
  });

  Crafty.c('Reticle', {
    init: function () {
      this.requires('2D, Canvas, Color')
        .attr({
          w: 10,
          h: 10,
        })
        .color("red");
    },
  });
});
