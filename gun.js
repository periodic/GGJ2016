/*
 * Guns and Bullets
 */
define(['crafty', 'constants', 'util/center'], function (Crafty, k) {

  Crafty.c('Gun', {
    required: '2D, Center, Delay',
    _fireRate: 1,
    _direction: new Crafty.math.Vector2D(0, 1),
    _defaultDirection: new Crafty.math.Vector2D(0, 1),
    _shotRequested: false,
    _isShooting: false,
    _bulletSpeed: 100,
    _bulletDamage: 1,
    _additionalTargets: [],
    init: function () {
    },
    fireRate: function (fireRate) {
      if (fireRate) {
        this._fireRate = fireRate;
        return this;
      }
      return this._fireRate;
    },
    bulletDamage: function (bulletDamage) {
      if (bulletDamage) {
        this._bulletDamage = bulletDamage;
        return this;
      }
      return this._bulletDamage;
    },
    bulletSpeed: function (bulletSpeed) {
      if (bulletSpeed) {
        this._bulletSpeed = bulletSpeed;
        return this;
      }
      return this._bulletSpeed;
    },
    direction: function (direction) {
      if (direction) {
        this._direction = direction;
        return this;
      }
      return this._direction;
    },
    additionalTargets: function (additionalTargets) {
      if (additionalTargets) {
        this._additionalTargets = additionalTargets;
        return this;
      }
      return this._additionalTargets;
    },
    startShooting: function () {
      this._shotRequested = true;

      if (!this._isShooting) {
        this._isShooting = true;
        this._fireProjectile();
        this.delay(this._fireProjectile, 1000 * k.player.fireRate, -1);
      }
    },
    stopShooting: function () {
      this._shotRequested = false;
    },
    _fireProjectile: function () {
      if (this._isShooting && this._shotRequested) {
        var velocity = this._direction.clone().scale(this._bulletSpeed);
        var position = this.center().add(this._direction.clone().scale(k.gun.offset));
        var bullet = Crafty.e('Bullet')
          .center(position)
          .damage(this._bulletDamage)
          .attr({
            vx: velocity.x,
            vy: velocity.y,
          });
        this._additionalTargets.forEach(function (targetType) {
          bullet.checkHits(targetType);
        });
      } else {
        this.cancelDelay(this._fireProjectile);
        this._isShooting = false;
      }
    },
  });

  Crafty.c('Bullet', {
    required: '2D, Canvas, Color, Collision, Motion, Center',
    _originalPosition: undefined,
    _damage: 0,
    init: function () {
      this.attr({
          w: 5,
          h: 5,
          z: k.layers.bullets,
        })
        .collision()
        .checkHits('ImpassableTile')
        .color('green');
    },
    damage: function (damage) {
      if (damage) {
        this._damage = damage;
        return this;
      }
      return this._damage;
    },
    events: {
      Moved: function (e) {
        if (this._originalPosition === undefined) {
          this._originalPosition = new Crafty.math.Vector2D(this._x, this._y);
        }

        if (this.center().subtract(this._originalPosition).magnitude() > k.bullet.maxDistance) {
          this.destroy();
        }
      },
      HitOn: function (hitData) {
        hitData.forEach(function (hit) {
          if (hit.obj.damage) {
            hit.obj.damage(this._damage);
          }
        }, this);

        this.destroy();
      },
    },
  });

});
