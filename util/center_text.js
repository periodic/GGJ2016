
define(['crafty', 'constants'], function(Crafty, k) {

  Crafty.c('CenterText', {
    init: function () {
      this.requires('2D, Canvas, Text')
        .textFont({weight: 'bold', size: '16px', align: 'center'})
        .textColor('#FFFFFF');
    },
    centerHorizontal: function () {
      this.x = (Crafty.viewport.width - this._w) / 2;
      return this;
    },
    centerVertical: function () {
      this.y = (Crafty.viewport.height - this._h) / 2;
      return this;
    }
  });

});
