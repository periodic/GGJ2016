/*
 * Defines the scenes for our game.
 */
define(['crafty', 'constants', 'player', 'tiles', 'map', 'util/center_text'], function(Crafty, k) {

  Crafty.scene('TitleScreen', function () {
    Crafty.background('#000000');

    var listener = Crafty.e('2D, Keyboard')
      .bind('KeyDown', function () {
        Crafty.scene('Level');
      });

    var title = Crafty.e('CenterText')
      .textFont({weight: 'bold', size: '36px', align: 'center'})
      .textColor("#ffffff")
      .text('Global Game Jam 2016')
      .centerHorizontal()
      .attr({
        y: 100,
      });
    var instructions = Crafty.e('CenterText')
      .textFont({size: '20px', align: 'center'})
      .textColor("#ffffff")
      .text('Press any key to begin')
      .centerHorizontal()
      .attr({
        y: 400,
      });
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
      .bind('MouseMove', function(e) {
        Crafty.trigger("TargetMoved", e);
      });

    console.log("Adding a map?");
    Crafty.e('Map');

    Crafty.viewport.follow(Crafty('Player'), 0, 0);
  });
});

