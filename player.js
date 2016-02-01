/*
 * The player entity.
 */

define(['crafty', 'constants', 'gun', 'util/center', 'util/health', 'util/health_bar'], function (Crafty, k) {
  Crafty.sprite(
    k.player.width,
    k.player.height,
    'assets/Sprites/player.png',
    {
      'Player1': [0, 0],
    });

  Crafty.sprite('assets/Sprites/playerbullet.png', {PlayerBulletSprite: [0, 0, 18, 18]})

  Crafty.c('Player', {
    required: '2D, Canvas, Fourway, Collision, Color, Center, Player1, Health, SpriteAnimation, Delay',
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
      this._gun = Crafty.e('Gun')
        .attr({
          w: this._w,
          h: this._h,
        })
        .sprite('PlayerBulletSprite')
        .bulletSize(18, 18)
        .fireRate(k.player.fireRate)
        .bulletDamage(k.player.bulletDamage)
        .bulletSpeed(k.player.bulletSpeed)
        .additionalTargets(['Enemy']);
      this.attach(this._gun);

      this.reel('Walking', 1200, [[0,0], [1,0], [2,0], [3,0], [2,0], [1,0]]);
      this.animate('Walking', -1);

      if (k.debug) {
        this.addComponent('WiredHitBox');
      }

      this._healthBar = Crafty.e("HealthBar")
        .color(k.player.healthBar.color);
    },
    push: function (direction, distance) {
      var velocity = (new Crafty.math.Vector2D(- direction.x, - direction.y))
          .normalize()
          .scale(1000 * distance / k.player.knockbackDuration);

      console.log("Knockback", velocity);

      this.disableControl();
      this.attr({
        vx: velocity.x,
        vy: velocity.y,
      });
      this.cancelDelay(this.endPush);
      this.delay(this.endPush, k.player.knockbackDuration);
    },
    endPush: function () {
      this.attr({
        vx: 0,
        vy: 0,
      });
      this.enableControl();
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
      TargetMoved: function () {
        var mouse = new Crafty.math.Vector2D(Crafty.mousePos.x, Crafty.mousePos.y);
        var d = mouse.clone().subtract(this.center()).normalize();
        this._gun.direction(d);
      },
      Shoot: function () {
        this._gun.startShooting();
      },
      StopShoot: function () {
        this._gun.stopShooting();
      },
      HealthChanged: function (obj) {
        this._healthBar.percent(this.currentHealth() / this.maxHealth());
        if (this.currentHealth() <= 0) {
          console.log("You died.");
          Crafty.scene('Death');
        }
      },
      MaxHealthChanged: function (obj) {
        this._healthBar.percent(this.currentHealth() / this.maxHealth());
      },
    },
  });

  Crafty.sprite('assets/Sprites/reticle.png', {ReticleSprite: [0,0,28, 28]})

  Crafty.c('Reticle', {
    _offsetX: 0,
    _offsetY: 0,
    init: function () {
      this.requires('2D, Canvas, ReticleSprite, Center')
        .attr({
          w: 28,
          h: 28,
          z: k.layers.ui,
        });
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
