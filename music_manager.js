/*
 * An audio manager to prevent sound overlap.
 */

define(['crafty'], function (Crafty) {

  Crafty.c('MusicManager', {
    required: 'Storage',
    _loaded: false,
    musicManager: function (soundId) {
      this._soundId = soundId
      return this;
    },
    start: function () {
      console.log('Starting music.');
      if (!this._loaded) {
        log('Playing ' + this._soundId);
        Crafty.audio.play(this._soundId, -1);
        this._loaded = true;
      }
    },
    events: {
      PauseMusic: function () {
        this._pauseMusic();
      },
      UnpauseMusic: function () {
        this._unpauseMusic();
      },
      PauseMusic: function () {
        this._pauseMusic();
      },
      UnpauseMusic: function () {
        this._unpauseMusic();
      },
    },
    _pauseMusic: function () {
      console.log('Pausing ' + this._soundId);
      Crafty.audio.pause(this._soundId);
      Crafty.storage("musicStartsPaused", true);
    },
    _unpauseMusic: function () {
      console.log('Unpausing ' + this._soundId);
      Crafty.audio.unpause(this._soundId);
      Crafty.storage("musicStartsPaused", false);
    },
  });
});
