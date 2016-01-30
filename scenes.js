/*
 * Defines the scenes for our game.
 */
define(['crafty', 'constants', 'player', 'util/center_text'], function(Crafty, k) {

  Crafty.scene('TitleScreen', function () {
    Crafty.background('#CCCCCC');

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
    Crafty.e('Player');
    var reticle = Crafty.e('Reticle');

    Crafty.e('2D, Canvas, Mouse')
      .attr({
        w: k.canvasWidthPx,
        h: k.canvasHeightPx,
        x: 0,
        y: 0,
      })
      .bind('MouseMove', function(e) {
        var reticle = Crafty('Reticle');
        reticle.attr({
          x: Crafty.mousePos.x - reticle.w / 2,
          y: Crafty.mousePos.y - reticle.h / 2,
        });
      })
      .bind('ViewportScroll', function (e) {
        this.attr({
          x: -Crafty.viewport.x,
          y: -Crafty.viewport.y,
        });
      });

    Crafty.viewport.follow(Crafty('Player'), 0, 0);
  });
});

