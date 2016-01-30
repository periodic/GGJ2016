/*
 * The player entity.
 */

define(['crafty', 'constants', 'util/center'], function (Crafty, k) {
  Crafty.c('Player', {
    required: '2D, Canvas, Fourway, Collision, Color, Center',
    init: function () {
      this.attr({
          w: k.characterWidth,
          h: k.characterHeight,
          z: k.layers.player,
        })
        .color("red")
        .origin("center")
        .fourway(k.characterSpeed)
        .collision(
          [k.characterCollision.xMin, k.characterCollision.yMin],
          [k.characterCollision.xMin, k.characterCollision.yMax],
          [k.characterCollision.xMax, k.characterCollision.yMax],
          [k.characterCollision.xMax, k.characterCollision.yMin])
        .attach(Crafty.e('Gun'));
    },
  });

  Crafty.c('Gun', {
    required:'2D, Canvas, Center',
    init: function () {
      this.attr({
          w: k.characterWidth,
          h: k.characterHeight,
          z: k.layers.gun,
        })
        .origin('center')
        .attach(Crafty.e('2D, Canvas, Color')
          .origin('center')
          .attr({
            w: 20,
            h: 5,
            x: 40,
            y: 20 - 2.5,
            z: k.layers.gun,
          })
          .color("blue")
        );
      this._direction = {x: 0, y: 0};
      this._defaultDirection = new Crafty.math.Vector2D(0, 1);
    },
    events: {
      TargetMoved: function () {
        var mouse = new Crafty.math.Vector2D(Crafty.mousePos.x, Crafty.mousePos.y);
        var d = mouse.clone().subtract(this.center());
        this._direction = d.clone().normalize();
        var angle = this._defaultDirection.angleTo(d) * 180 / Math.PI;
        this.attr({
          rotation: angle,
        });
      },
      Shoot: function (e) {
        var direction = e.clone().subtract(this.center()).normalize();
        var velocity = direction.clone().scale(k.bullet.speed);
        var position = this.center().add(direction.clone().scale(40));
        var bullet = Crafty.e('Bullet')
          .center(position)
          .originalPosition(position)
          .attr({
            vx: velocity.x,
            vy: velocity.y,
          });

      },
    },
  });

  Crafty.c('Bullet', {
    required: '2D, Canvas, Color, Collision, Motion, Center',
    init: function () {
      this.attr({
          w: 5,
          h: 5,
          z: k.layers.bullets,
        })
        .color('yellow');
      this._travelled = {x: 0, y: 0};
    },
    _originalPosition: Crafty.math.Vector2D(0, 0),
    originalPosition: function (pos) {
      this._originalPosition = pos;
      return this;
    },
    events: {
      Moved: function (e) {
        if (this.center().subtract(this._originalPosition).magnitude() > k.bullet.maxDistance) {
          this.destroy();
        }
      },
    },
  });

  Crafty.c('Reticle', {
    _offsetX: 0,
    _offsetY: 0,
    init: function () {
      this.requires('2D, Canvas, Color, Center')
        .attr({
          w: 10,
          h: 10,
          z: k.layers.gun,
        })
        .color("blue");
    },
    events: {
      TargetMoved: function (e) {
        this.center(e.realX, e.realY);
        this._offsetX = e.offsetX;
        this._offsetY = e.offsetY;
      },
      ViewportScroll: function () {
        this.center(
          this._offsetX - Crafty.viewport.x,
          this._offsetY - Crafty.viewport.y);
      },
    },
  });
});
