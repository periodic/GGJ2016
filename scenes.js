/*
 * Defines the scenes for our game.
 */
define(['crafty', 'constants', 'player', 'enemy', 'tiles', 'map', 'util/center_text'], function(Crafty, k) {

  function writeText(lines) {
    var y = Crafty.viewport.height / 2 - 50 * lines.length;
    lines.forEach(function (line) {
      var text = line[0];
      var size = line[1] || 36;
      var weight = line[2] || true;

      var graphic = Crafty.e('CenterText')
        .textColor("#ffffff")
        .textFont({size: size + 'px', align: 'center'})
        .text(text)
        .centerHorizontal()
        .attr({
          y: y,
        });
      if (weight) {
        graphic.textFont({weight: 'bold'});
      }
      y += 100;
    });
  };

  Crafty.c('AdvanceOnKeypress', {
    required: '2D, Keyboard',
    _nextScene: undefined,
    nextScene: function (scene) {
      this._nextScene = scene;
    },
    events: {
      KeyDown: function () {
        Crafty.scene(this._nextScene);
      },
    },
  });

  Crafty.c('AdvanceOnLevelComplete', {
    required: '2D',
    _nextScene: undefined,
    nextScene: function (scene) {
      this._nextScene = scene;
    },
    events: {
      LevelComplete: function () {
        Crafty.scene(this._nextScene);
      },
    },
  });

  Crafty.scene('TitleScreen', function () {
    Crafty.background('#000000');

    writeText([
      ['Global Game Jam 2016', 36, true],
      ['Press any key to begin', 24, false],
      ]);

    Crafty.e('AdvanceOnKeypress').nextScene('IntroScreen');
  });


  Crafty.scene('IntroScreen', function () {
    Crafty.background('#000000');

    writeText([
      ['You have been summoned.', 36, true],
      ['But they made a mistake and want to banish you.', 36, true],
      ['Click to defend yourself.', 24, false],
      ['Don\'t let your health run out.', 24, false],
      ]);

    Crafty.e('AdvanceOnKeypress').nextScene('Level');
  });


  Crafty.scene('Level', function () {
    Crafty.background('#000000');
    Crafty.e('Player').center(0, 0);
    Crafty.e('Reticle');

    Crafty.e('2D, Canvas, Mouse')
      .attr({
        w: Crafty.viewport.width,
        h: Crafty.viewport.height,
        x: 0,
        y: 0,
      })
      .bind('MouseDown', function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
          Crafty.trigger("Shoot", new Crafty.math.Vector2D(Crafty.mousePos.x, Crafty.mousePos.y));
        }
      })
      .bind('MouseUp', function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
          Crafty.trigger("StopShoot");
        }
      })
      .bind('ViewportScroll', function (e) {
        this.attr({
          x: -Crafty.viewport.x,
          y: -Crafty.viewport.y,
        });
      })
      .bind('ViewportResize', function (e) {
        this.attr({
          w: Crafty.viewport.width,
          h: Crafty.viewport.height,
        });
      })
      .bind('MouseMove', function(e) {
        Crafty.trigger("TargetMoved", e);
      });

    console.log("Adding a map?");
    Crafty.e('Map');

    Crafty.viewport.follow(Crafty('Player'), 0, 0);

    Crafty.e('AdvanceOnLevelComplete').nextScene('Victory');
  });

  Crafty.scene('Death', function () {
    Crafty.background('#000000');

    writeText([
      ['You have been slain.', 36, true],
      ['Press any key to start again', 24, false],
      ]);

    Crafty.e('AdvanceOnKeypress').nextScene('Level');
  });

  Crafty.scene('Victory', function () {
    Crafty.background('#000000');

     writeText([
          ['You have escaped those who would enslave you.', 36, false],
          ['The world is yours to feast upon.', 36, false],
          ['Created by: Andrew Haven, Brian Torrence, Lindsay Haven, and Zoe Patrick.', 24, false],
      ]);

  Crafty.e('AdvanceOnKeypress').nextScene('TitleScreen');
  });
});

