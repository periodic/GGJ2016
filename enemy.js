/*
 * Enemies!
 */
define(['crafty', 'constants', 'util/center', 'util/health'], function (Crafty, k) {

  Crafty.audio.add('FemaleDeath', 'assets/Sound/humandeathfemale1.mp3');
  Crafty.audio.add('MaleDeath', 'assets/Sound/humandeathmale1.mp3');
  Crafty.audio.add('GunShot', 'assets/Sound/weaponrangepistol1.mp3');
  Crafty.audio.add('MeleeHit', 'assets/Sound/meleehit1.wav');

  Crafty.sprite(
    40, 68, 'assets/Sprites/enemies.png',
    {
      'PoliceSprite': [0, 0],
      'BruteSprite': [1, 0],
      'FemaleSprite': [2, 0],
    });

  Crafty.sprite('assets/Sprites/enemybullet.png', {EnemyBulletSprite: [0, 0, 6, 10]})

  var MEANDER_DIRECTIONS = [
    new Crafty.math.Vector2D(0,  1),
    new Crafty.math.Vector2D(1,  0),
    new Crafty.math.Vector2D(0, -1),
    new Crafty.math.Vector2D(-1, 0),
  ];

  Crafty.c('Enemy', {
    required: '2D, Canvas, Health, Motion, Collision, Center, Delay',
    init: function () {
      this.attr({
        z: k.layers.enemies,
      });

    },
    activate: function () {
      this.trigger("PlayerInRange");
    },
    deactivate: function () {
      this.trigger("PlayerOutOfRange");
      this.attr({
        vx: 0,
        vy: 0,
      });
    },
    events: {
      HealthChanged: function () {
        if (this.currentHealth() <= 0) {
          this.trigger('Death');
          this.destroy();
          console.log("Died!");
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
    },
    _playerInRange: false,
    _updateAI: function () {
      var player = Crafty('Player');
      var distance = player.center().subtract(this.center()).magnitude();

      if (distance < k.enemy.aiResponseDistance) {
        if (!this._playerInRange) {
          console.log("The player entered range!");
          this.trigger("PlayerInRange", player);
          this._playerInRange = true;
        }
      } else {
        if (this._playerInRange) {
          console.log("The player left range!");
          this.trigger("PlayerOutOfRange");
          this._playerInRange = false;
        }

        // Uncomment to enable idle meandering.
        // this._meander();
      }
    },
    _meander: function () {
      if (Math.random() < k.enemy.meanderDirectionChangeChance) {
        var i = Math.floor(Math.random() * MEANDER_DIRECTIONS.length);
        this.attr({
          vx: MEANDER_DIRECTIONS[i].x * k.enemy.meanderSpeed,
          vy: MEANDER_DIRECTIONS[i].y * k.enemy.meanderSpeed,
        });
      }
    },
  });

  Crafty.c("Police", {
    required: 'Enemy, PoliceSprite, Gun, Delay',
    init: function () {
      this.attr({
          w: 34,
          h: 68,
        })
        .health(k.enemy.police.maxHealth)
        .fireRate(k.enemy.police.fireRate)
        .bulletDamage(k.enemy.police.bulletDamage)
        .bulletSpeed(k.enemy.police.bulletSpeed)
        .bulletSprite('EnemyBulletSprite')
        .bulletSize(6, 10)
        .additionalTargets(['Player'])
        .collision([ // Slightly taller than a tile.
          0, 10,
          0, 68,
          34, 68,
          34, 10,
        ]);
    },
    events: {
      Death: function () {
        Crafty.audio.play('MaleDeath');
      },
      PlayerInRange: function () {
        this._attackPlayer();
        this.startShooting();
        this.delay(this._attackPlayer, 100, -1);
      },
      PlayerOutOfRange: function () {
        this.cancelDelay(this._attackPlayer);
        this.stopShooting();
      },
      ShotFired: function () {
        Crafty.audio.play('GunShot', -1, 0.5);
      },
    },
    _attackPlayer: function () {
      var player = Crafty('Player');
      var difference = player.center().subtract(this.center());
      var direction = difference.clone().normalize();

      this.direction(direction);

      if (difference.magnitude() > k.enemy.police.preferredDistance) {
        var movement = direction.clone().scale(k.enemy.police.speed);
        this.attr({
          vx: movement.x,
          vy: movement.y,
        });
      } else {
        this.attr({
          vx: 0,
          vy: 0,
        });
      }
    }
  });

  Crafty.c("Brute", {
    required: 'Enemy, BruteSprite, Delay',
    init: function () {
      this.attr({
          w: 38,
          h: 64,
        })
        .health(k.enemy.brute.maxHealth)
        .checkHits('Player')
        .collision([
          0, 10,
          0, 64,
          38, 64,
          38, 10,
        ]);
    },
    events: {
      Death: function () {
        Crafty.audio.play('MaleDeath');
      },
      PlayerInRange: function () {
        this.delay(this._attackPlayer, 100, -1);
      },
      PlayerOutOfRange: function () {
        this.cancelDelay(this._attackPlayer);
      },
      HitOn: function (hitData) {
        // should only trigger on player hits.
        console.log(hitData);

        var player = hitData[0].obj;
        player.damage(k.enemy.brute.meleeDamage);
        player.trigger('Hit');

        player.push(hitData[0].normal, k.enemy.brute.knockbackDistance);

        Crafty.audio.play('MeleeHit');

        this.cancelDelay(this.resetHitChecks);
        this.delay(this.resetHitChecks, 500);
      },
    },
    _attackPlayer: function () {
      var player = Crafty('Player');
      var difference = player.center().subtract(this.center());
      var direction = difference.clone().normalize();

      var movement = direction.clone().scale(k.enemy.police.speed);
      this.attr({
        vx: movement.x,
        vy: movement.y,
      });
    },
  });

  Crafty.c("Female", {
    required: 'Enemy, FemaleSprite, Gun',
    init: function () {
      this.attr({
          w: 24,
          h: 60,
        })
        .health(k.enemy.female.maxHealth)
        .fireRate(k.enemy.female.fireRate)
        .bulletDamage(k.enemy.female.bulletDamage)
        .bulletSpeed(k.enemy.female.bulletSpeed)
        .bulletSprite('EnemyBulletSprite')
        .bulletSize(6, 10)
        .additionalTargets(['Player'])
        .collision();
    },
    events: {
      Death: function () {
        Crafty.audio.play('FemaleDeath');
      },
      PlayerInRange: function () {
        this._attackPlayer();
        this.startShooting();
        this.delay(this._attackPlayer, 100, -1);
      },
      PlayerOutOfRange: function () {
        this.cancelDelay(this._attackPlayer);
        this.stopShooting();
      },
      ShotFired: function () {
        Crafty.audio.play('GunShot', -1, 0.5);
      },
    },
    _attackPlayer: function () {
      var player = Crafty('Player');
      var difference = player.center().subtract(this.center());
      var direction = difference.clone().normalize();

      this.direction(direction);
    }
  });
});
