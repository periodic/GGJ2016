/*
 * A compontent for things that have health.
 */
define(['crafty'], function (Crafty) {

  Crafty.c('Health', {
    _maxHealth: 100,
    _currentHealth: 100,
    health: function (maxHealth) {
      this._maxHealth = maxHealth;
      this._currentHealth = maxHealth;
      return this;
    },
    damage: function (damage) {
      this._currentHealth = this._clampHealth(this._currentHealth - damage);
      this.trigger('HealthChanged', this);
      return this;
    },
    currentHealth: function (currentHealth) {
      if (currentHealth) {
        this._currentHealth = this._clampHealth(currentHealth);
        this.trigger('HealthChanged', this);
        return this;
      }
      return this._currentHealth;
    },
    maxHealth: function (maxHealth) {
      if (maxHealth) {
        this._maxHealth = maxHealth;
        Crafty.trigger('MaxHealthChanged', this);
        return this;
      }
      return this._maxHealth;
    },
    _clampHealth: function (health) {
      return Math.min(this._maxHealth, Math.max(0, health));
    },
  });

});
