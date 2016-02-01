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

  Crafty.c('Player', {
    required: '2D, Canvas, Fourway, Collision, Color, Center, Player1, Health, SpriteAnimation',
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
