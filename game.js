/*
 * Game setup.
 */
define(['constants', 'scenes', 'crafty', 'music_manager', 'buttons'], function (k, scenes) {
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

  Crafty.scene('TitleScreen');
});
