
define(['crafty', 'constants'], function(Crafty, k) {

  Crafty.c('CenterText', {
    init: function () {
      this.requires('2D, Canvas, Text')
        .textFont({weight: 'bold', size: '16px', align: 'center'})
        .textColor('#FFFFFF');
    },
    centerHorizontal: function () {
      this.x = (k.canvasWidthPx - this._w) / 2;
      return this;
    },
    centerVertical: function () {
      this.y = (k.canvasHeightPx - this._h) / 2;
      return this;
    }
  });

});
