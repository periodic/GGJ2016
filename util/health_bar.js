
define(['crafty', 'constants'], function (Crafty, k) {
  Crafty.c('HealthBar', {
    required: '2D, Canvas, Color',
    init: function () {
      this.attr({
        x: k.player.healthBar.x,
        y: k.player.healthBar.y,
        h: k.player.healthBar.h,
        w: k.player.healthBar.w,
        z: k.layers.ui,
      })
    },
    percent: function (percent) {
      this.w = k.player.healthBar.w * percent;
    },
    events: {
      ViewportScroll: function () {
        this.attr({
          x: k.player.healthBar.x - Crafty.viewport.x,
          y: k.player.healthBar.y - Crafty.viewport.y,
        });
      }
    },
  });
});
