/*
 * Defines the scenes for our game.
 */
define(['crafty', 'constants', 'player', 'tiles', 'util/center_text'], function(Crafty, k) {

  Crafty.scene('TitleScreen', function () {
    Crafty.background('#cccccc');

    var listener = Crafty.e('2D, Keyboard')
      .bind('KeyDown', function () {
        Crafty.scene('Level');
      });

    var title = Crafty.e('CenterText')
      .textFont({weight: 'bold', size: '36px', align: 'center'})
      .textColor("#000000")
      .text('Global Game Jam 2016')
      .centerHorizontal()
      .attr({
        y: 100,
      });
    var instructions = Crafty.e('CenterText')
      .textFont({size: '20px', align: 'center'})
      .textColor("#000000")
      .text('Press any key to begin')
      .centerHorizontal()
      .attr({
        y: 400,
      });
  });


  Crafty.scene('Level', function () {
    Crafty.background('#000000');
    Crafty.e('Player')
      .center(k.canvasWidthPx / 2, k.canvasHeightPx / 2);
    Crafty.e('Reticle');

    Crafty.e('2D, Canvas, Mouse')
      .attr({
        w: k.canvasWidthPx,
        h: k.canvasHeightPx,
        x: 0,
        y: 0,
      })
      .bind('MouseDown', function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
          Crafty.trigger("Shoot", new Crafty.math.Vector2D(Crafty.mousePos.x, Crafty.mousePos.y));
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

    var rows = k.canvasWidthPx / k.tile.width;
    var cols = k.canvasHeightPx / k.tile.height;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = r * k.tile.width;
        var y = c * k.tile.height;
        if (r == 0 || c == 0 || r == rows - 1 || c == cols - 1) {
          Crafty.e('Wall').attr({
            x: x,
            y: y,
          });
        } else {
          Crafty.e('Floor').attr({
            x: x,
            y: y,
          });
        }
      }
    }

    Crafty.viewport.follow(Crafty('Player'), 0, 0);
  });
});

