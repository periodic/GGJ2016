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

  Crafty.audio.add('DemonDeath', 'assets/Sound/demondeath1.mp3');
  Crafty.audio.add('DemonHurt', 'assets/Sound/demonhurt1.mp3');
  Crafty.audio.add('DemonMovement', 'assets/Sound/demonmovement1.mp3');
  Crafty.audio.add('DemonSummon', 'assets/Sound/demonsummon1.mp3');

  Crafty.c('Player', {
    required: '2D, Canvas, Fourway, Collision, Color, Center, Player1, Health, SpriteAnimation, Delay, Gun',
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
        .fireRate(k.player.fireRate)
        .bulletSprite('PlayerBulletSprite')
        .bulletSize(18, 18)
        .bulletDamage(k.player.bulletDamage)
        .bulletSpeed(k.player.bulletSpeed)
        .additionalTargets(['Enemy']);

      this.reel('Walking', 1200, [[0,0], [1,0], [2,0], [3,0], [2,0], [1,0]]);
      this.animate('Walking', -1);

      if (k.debug) {
        this.addComponent('WiredHitBox');
      }

      Crafty.audio.play('DemonSummon', 1, k.volume.demonSummon);

      this._healthBar = Crafty.e("HealthBar")
        .color(k.player.healthBar.color);
    },
    remove: function () {
      Crafty.audio.stop('DemonMovement');
    },
    push: function (direction, distance) {
      var velocity = (new Crafty.math.Vector2D(- direction.x, - direction.y))
          .normalize()
          .scale(1000 * distance / k.player.knockbackDuration);

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
      HealthChanged: function (obj) {
        this._healthBar.percent(this.currentHealth() / this.maxHealth());
        if (this.currentHealth() <= 0) {
          Crafty.audio.play('DemonDeath', 1, k.volume.demonDeath);
          Crafty.scene('Death');
        }
      },
      Hit: function () {
        Crafty.audio.play('DemonHurt', 1, k.volume.demonHurt);
      },
      MaxHealthChanged: function (obj) {
        this._healthBar.percent(this.currentHealth() / this.maxHealth());
      },
      NewDirection: function () {
        if (this._vx !== 0 || this._vy !== 0) {
          if (!Crafty.audio.isPlaying('DemonMovement')) {
            Crafty.audio.play('DemonMovement', -1, k.volume.demonMovement);
          }
        } else {
          Crafty.audio.stop('DemonMovement');
        }
      },
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
      Shoot: function () {
        this.startShooting();
      },
      StopShoot: function () {
        this.stopShooting();
      },
      ShotFired: function () {
        // Need audio.
      },
      TargetMoved: function () {
        var mouse = new Crafty.math.Vector2D(Crafty.mousePos.x, Crafty.mousePos.y);
        var d = mouse.clone().subtract(this.center()).normalize();
        this.direction(d);
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
