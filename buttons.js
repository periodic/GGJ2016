/*
 * Defines the buttons that go up in the upper-right.
 */
define(['crafty', 'constants'], function(Crafty, k) {
  /*
   * The mute button.
   */
  Crafty.c("MuteButton", {
    _stopped: false,
    _position: {
      x: 0,
      y: 0,
    },
    init: function () {
      this.requires("2D, Canvas, Persist, Image, Mouse, Button")
          .image('assets/audio-high.png')
          .bind('ViewportScroll', this._onScroll)
          .attr({
            w: 32,
            h: 32,
           });

      this._stopped = Crafty.storage("musicStartsPaused");
      if (this._stopped) {
        this._mute();
      }
    },
    events: {
      Click: function () {
        log('Clicked');
        if (this._stopped) {
          this._unmute();
        } else {
          this._mute();
        }
      },
      ViewportScroll: function () {
        this._updatePosition();
      },
      ViewportResize: function () {
        this._updatePosition();
      },
    },
    absolutePosition: function (coords) {
      this._position = coords;
      this._updatePosition();
      return this;
    },
    _updatePosition: function () {
      if (this._position.x > 0) {
        this.x = -Crafty.viewport.x + this._position.x;
      } else {
        this.x = Crafty.viewport.width - Crafty.viewport.x + this._position.x;
      }
      if (this._position.y > 0) {
        this.y = -Crafty.viewport.y + this._position.y;
      } else {
        this.y = Crafty.viewport.height - Crafty.viewport.y + this._position.y;
      }
    },
    _unmute: function () {
      this._stopped = false;
      this.image('assets/audio-high.png')

      Crafty.trigger('UnpauseMusic');
    },
    _mute: function () {
      this._stopped = true;
      this.image('assets/audio-mute.png')

      Crafty.trigger('PauseMusic');
    },
  });

});
