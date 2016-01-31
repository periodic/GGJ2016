
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
    track: function (entity) {
      this._trackedEntity = entity;
      return this;
    },
    _trackedEntity: undefined,
    events: {
      HealthChanged: function (obj) {
        if (obj[0] === this._trackedEntity[0]) {
          this.w = k.player.healthBar.w * obj.currentHealth() / obj.maxHealth();
        }
      },
      MaxHealthChanged: function (obj) {
        if (obj[0] === this._trackedEntity[0]) {
          this.w = k.player.healthBar.w * obj.currentHealth() / obj.maxHealth();
        }
      },
      ViewportScroll: function () {
        this.attr({
          x: k.player.healthBar.x - Crafty.viewport.x,
          y: k.player.healthBar.y - Crafty.viewport.y,
        });
      }
    },
  });
});
