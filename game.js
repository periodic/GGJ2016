/*
 * Game setup.
 */
define(['crafty', 'constants', 'scenes', 'music_manager', 'buttons', 'metric'], function (Crafty, k, scenes) {
  Crafty.init(k.canvasWidthPx, k.canvasHeightPx);
  Crafty.viewport.init(); // full screen
  Crafty.viewport.clampToEntities = false; // Set to true to prevent scrolling away.
  Crafty.audio.setChannels(10);

  Crafty.audio.add('BackgroundMusic', 'assets/Sound/soundtrack.mp3');

  Crafty.e('MusicManager').musicManager('BackgroundMusic').start();
  Crafty.e('MuteButton').absolutePosition({
    x: 10,
    y: -42,
  }).attr({
    z: k.layers.ui,
  });

  if (k.debug) {
    Crafty.e('Metric')
      .metric("FrameTime")
      .absolutePosition({
        x: 0,
        y: 100,
      })
      .bind("MeasureFrameTime", function (time) {
        this.record(time);
      });

    Crafty.e('Metric')
      .metric("RenderTime")
      .absolutePosition({
        x: 0,
        y: 150,
      })
      .bind("MeasureRenderTime", function (time) {
        this.record(time);
      });
    Crafty.e('Metric')
      .metric("WaitTime")
      .absolutePosition({
        x: 0,
        y: 200,
      })
      .bind("MeasureWaitTime", function (time) {
        this.record(time);
      });
  }

  Crafty.scene('TitleScreen');
});
