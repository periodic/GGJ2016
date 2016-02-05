/*
 * Builds the map and renders it.
 */
define([
  'crafty',
  'constants',
  'map_generator',
  'data/roomdata',
  'tiles',
  'enemy',
  'util/center',
  'circle',
  ], function(Crafty, k, map, roomData) {

  var DIRECTIONS = [k.NORTH, k.EAST, k.SOUTH, k.WEST];
  var ENEMY_TYPES = ['Police', 'Brute', 'Female'];

  Crafty.c('Map', {
    init: function () {
      var rooms = map.generateMap(
        k.map.rows,
        k.map.columns,
        k.map.originR,
        k.map.originC,
        k.map.exitR,
        k.map.exitC);

      var roomWidth = k.room.width * k.tile.width;
      var roomHeight = k.room.height * k.tile.height;

      var baseOffsetX = - roomWidth / 2;
      var baseOffsetY = - roomHeight / 2;

      rooms.forEach(function (row, r) {
        row.forEach(function (directions, c) {
          if (directions) {
            if (typeof(directions) !== "object") debugger;

            var room = Crafty.e('Room').room(r, c, directions);

            if ((r == k.map.originR && c == k.map.originC)) {
              room.attach(Crafty.e('StartingCircle').center(room.center()));
            } else if (r == k.map.exitR && c == k.map.exitC) {
              room.attach(Crafty.e('EndingCircle').center(room.center()));

              var offset = new Crafty.math.Vector2D(0, 150);
              var rotationMatrix = (new Crafty.math.Matrix2D()).rotate(2 * Math.PI / 7);
              for (var i = 0; i < 7; i++) {
                room.attach(Crafty.e('Female').center(room.center().add(offset)));
                rotationMatrix.apply(offset);
              }
            } else {
              for (var i = 0; i < k.enemy.perRoom; i++) {
                room.addEnemy();
              }
            }
            room.attr({
              x: c * roomWidth + baseOffsetX,
              y: r * roomHeight + baseOffsetY,
            }, true);
          }
        });
      });
    },
  });

  Crafty.c('Room', {
    required: '2D, Canvas, DebugRectangle, Center, Collision',
    _template: undefined,
    _r: 0, // for tracking where this room is.
    _c: 0, // for tracking where this room is.
    init: function () {
      this.attr({
          w: k.tile.height * k.room.width,
          h: k.tile.width * k.room.height,
          x: 0,
          y: 0,
          z: k.layers.background,
        })
        .origin('center')
        .collision();
        //.checkHits('Player');
      if (k.debug) {
        this.debugStroke("green")
          .debugRectangle(this);
      }
    },

    room: function (r, c, directions) {
      this._r = r;
      this._c = c;

      var template = this._chooseTemplate(directions);

      // number of turns from template to directions.
      var turns = this._canFitToTemplate(template.exits, directions);

      this.addComponent(template.floorSprite);

      this.attach(Crafty.e('2D, Canvas')
        .addComponent(template.wallSprite)
        .attr({
          x: this._x,
          y: this._y,
          w: this._w,
          h: this._h,
          z: k.layers.obstacles,
        }));

      for (var r = 0; r < k.room.height; r++) {
        for (var c = 0; c < k.room.width; c++) {
          var x = c * k.tile.width;
          var y = r * k.tile.height;

          var tileSymbol = template.room[r][c];

          if (tileSymbol === 'X' || tileSymbol === undefined) {
            this.attach(
              Crafty.e('Wall').attr({
                x: x,
                y: y,
              }));
          }
        }
      }

      this.rotation = turns * 90;

      this._template = template;
      this._turns = turns;

      return this;
    },

    addEnemy: function () {
      var enemyType = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];

      var searching = true;
      while (searching) {
        var r = Math.floor(Math.random() * k.room.height);
        var c = Math.floor(Math.random() * k.room.width);

        if (this._getTile(r, c, this._turns, this._template) === " ") {
          var enemy = Crafty.e(enemyType);
          enemy.attr({
              x: c * k.tile.width,
              y: (r + 1) * k.tile.height - enemy.h,
            });
          this.attach(enemy);
          searching = false;
        }
      }
    },

    events: {
      PlayerEntered: function () {
        // Player has entered, turn on AI.
        Crafty.map.search(this, true).forEach(function (entity) {
          if (entity.has('Enemy')) {
            entity.activate();
          }
        });
      },
      PlayerExited: function () {
        // Player has left, turn off AI.
        Crafty.map.search(this, true).forEach(function (entity) {
          if (entity.has('Enemy')) {
            entity.deactivate();
          }
        });
      },
    },

    _getTile: function (r, c, turns, template) {
      var index = this._rotateIndex(r, c, turns);
      return template.room[index[0]][index[1]];
    },

    _rotateIndex: function(r, c, turns) {
      turns = turns % 4;
      if (turns == 0) {
        return [r, c]
      } else if (turns == 1) {
        // (c + ir) * -i = r - ic
        return [k.room.height - 1 - c, r];
      } else if (turns == 2) {
        // (c + ir) * -1 = -c - ir
        return [k.room.width - 1 - r, k.room.height - 1 - c];
      } else if (turns == 3) {
        // (c + ir) * i = -r + ic
        return [c, k.room.width - 1 - r];
      }
    },

    _chooseTemplate: function (directions) {
      var matchingTemplates = roomData.filter(function (template) {
        return this._canFitToTemplate(directions, template.exits) >= 0;
      }, this);

      if (matchingTemplates.length == 0) {
        console.error("Could not find a matching template for room configuration", directions);
        debugger;
      }

      var i = Math.floor(Math.random() * matchingTemplates.length);

      if (directions.length != matchingTemplates[i].exits.length) debugger;

      return matchingTemplates[i];
    },

    _canFitToTemplate: function (directions, templateDirections) {
      if (directions.length !== templateDirections.length) return -1;

      for (var turns = 0; turns < DIRECTIONS.length; turns++) {
        if (this._directionsEqual(
              this._rotateSet(directions, turns),
              templateDirections)) {
          return turns;
        }
      }

      return -1;
    },

    _directionsEqual: function (d1, d2) {
      if (d1.length !== d2.length) return false;

      return d1.every(function (d) {
        return d2.indexOf(d) >= 0;
      });
    },

    _rotateSet: function (directions, turns) {
      return directions.map(function (dir) {
        return this._rotateDirection(dir, turns);
      }, this);
    },

    _rotateDirection: function (direction, turns) {
      return (direction + turns) % DIRECTIONS.length;
    }
  });
});
