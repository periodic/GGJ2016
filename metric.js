/*
 * A metric tracker for debugging.
 */
define(['crafty'], function (Crafty) {

  Crafty.c('Metric', {
    required: '2D, Canvas, Text, Persist',
    _prefix: 'Metric: ',
    _runningTotal: undefined,
    _position: {x: 0, y: 0},
    init: function () {
      this.attr({
          x: 100,
          y: 100,
          w: 100,
          h: 100,
          z: 1000,
        })
        .textFont({size: '16px', align: 'left'})
        .textColor('#FFFFFF');
    },
    metric: function (prefix) {
      this._prefix = prefix;
      return this;
    },
    record: function (value) {
      if (this._runningTotal === undefined) {
        this._runningTotal = value;
      } else {
        this._runningTotal = 0.99 * this._runningTotal + 0.01 * value;
      }
      this.text(this._prefix + ": " + this._runningTotal.toFixed(2));
      return this;
    },
    absolutePosition: function (coords) {
      this._position = coords;
      this._updatePosition();
      return this;
    },
    events: {
      ViewportScroll: function () {
        this._updatePosition();
      },
      ViewportResize: function () {
        this._updatePosition();
      },
    },
    _updatePosition: function () {
      if (this._position.x >= 0) {
        this.x = -Crafty.viewport.x + this._position.x;
      } else {
        this.x = Crafty.viewport.width - Crafty.viewport.x + this._position.x;
      }
      if (this._position.y >= 0) {
        this.y = -Crafty.viewport.y + this._position.y;
      } else {
        this.y = Crafty.viewport.height - Crafty.viewport.y + this._position.y;
      }
    },
  });
});
