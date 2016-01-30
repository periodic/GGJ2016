/*
 * A component for doing computations off the center of an object.
 */
define(['crafty'], function (Crafty) {
  Crafty.c('Center', {
    required: '2D',
    center: function (x_or_vector, y) {
      if (x_or_vector === undefined) {
        return new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
      }
      if (y === undefined) {
        this.attr({
          x: x_or_vector.x - this._w / 2,
          y: x_or_vector.y - this._h / 2,
        });
        return this;
      }

      this.attr({
        x: x_or_vector - this._w / 2,
        y: y - this._h / 2,
      });
      return this;
    }
  });
});
