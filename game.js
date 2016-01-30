/*
 * Game setup.
 */
define(['constants', 'scenes', 'crafty'], function (k, scenes) {
  Crafty.init(k.canvasWidthPx, k.canvasHeightPx);
  Crafty.viewport.init(k.canvasWidthPx, k.canvasHeightPx);
  Crafty.viewport.clampToEntities = false; // Set to true to prevent scrolling away.

  Crafty.scene('TitleScreen');
});
