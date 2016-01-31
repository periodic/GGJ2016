/*
 * The player entity.
 */

define(['crafty', 'constants', 'util/center', 'util/health', 'util/health_bar'], function (Crafty, k) {
  Crafty.sprite(
    k.player.width,
    k.player.height,
    'assets/Sprites/player.png',
    {
      'Player1': [0, 0],
    });

  Crafty.c('Player', {
    required: '2D, Canvas, Fourway, Collision, Color, Center, Player1, Health',
    init: function () {
      this.attr({
          w: k.player.width,
          h: k.player.height,
          z: k.layers.player,
        })
        .health(k.player.maxHealth)
        .origin("center")
        .fourway(k.player.speed)
        .collision(
          k.player.collision.xMin, k.player.collision.yMin,
          k.player.collision.xMin, k.player.collision.yMax,
          k.player.collision.xMax, k.player.collision.yMax,
          k.player.collision.xMax, k.player.collision.yMin)
        .attach(Crafty.e('Gun'));

        if (k.debug) {
          this.addComponent('WiredHitBox');
        }

        Crafty.e("HealthBar")
          .track(this)
          .color(k.player.healthBar.color);
    },
    events: {
      Moved: function (e) {
        if (this.hit('ImpassableTile')) {
          if (e.axis == 'x') {
            this.x = e.oldValue;
          }
          if (e.axis == 'y') {
            this.y = e.oldValue;
          }
        }
      },
    },
  });

  Crafty.c('Gun', {
    required: '2D, Canvas, Center, Delay',
    init: function () {
      this.attr({
          w: k.player.height,
          h: k.player.width,
          z: k.layers.gun,
        })
        .origin('center')
        .attach(Crafty.e('2D, Canvas, Color')
          .origin('center')
          .attr({
            w: k.gun.width,
            h: k.gun.height,
            x: k.gun.offsetX,
            y: k.gun.offsetY,
            z: k.layers.gun,
          })
        );
      this._direction = {x: 0, y: 0};
      this._shotRequested = false;
      this._isShooting = false;
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
      Shoot: function () {
        this._shotRequested = true;

        if (!this._isShooting) {
          this._isShooting = true;
          this._fireProjectile();
          this.delay(this._fireProjectile, 1000 * k.player.fireRate, -1);
        }
      },
      StopShoot: function () {
        this._shotRequested = false;
      },
    },
    _fireProjectile: function () {
      if (this._isShooting && this._shotRequested) {
        var velocity = this._direction.clone().scale(k.bullet.speed);
        var position = this.center().add(this._direction.clone().scale(k.gun.width));
        var bullet = Crafty.e('Bullet')
          .center(position)
          .originalPosition(position)
          .attr({
            vx: velocity.x,
            vy: velocity.y,
          });
      } else {
        this.cancelDelay(this._fireProjectile);
        this._isShooting = false;
      }
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
        .collision()
        .checkHits('ImpassableTile')
        .color('green');
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
      HitOn: function (hitData) {
        this.destroy();
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
