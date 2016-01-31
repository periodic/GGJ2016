/*
 * Builds the map and renders it.
 */
define(['crafty', 'constants', 'map_generator', 'data/roomdata', 'tiles'], function(Crafty, k, map, roomData) {

  var DIRECTIONS = [k.NORTH, k.EAST, k.SOUTH, k.WEST];

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
        row.forEach(function (room, c) {
          if (room) {
            if (typeof(room) !== "object") debugger;

            Crafty.e('Room').room(room).attr({
              x: c * roomWidth + baseOffsetX,
              y: r * roomHeight + baseOffsetY,
            });
          }
        });
      });
    },
  });

  Crafty.c('Room', {
    required: '2D, Canvas, DebugRectangle',
    init: function () {
      this.attr({
          w: k.tile.height * k.room.width,
          h: k.tile.width * k.room.height,
          x: 0,
          y: 0,
          z: k.layers.background,
        })
        .origin('center');
      if (k.debug) {
        this.debugStroke("green")
          .debugRectangle(this);
      }
    },
    room: function (directions) {
      var template = this._chooseTemplate(directions);

      // number of turns from template to directions.
      var turns = this._canFitToTemplate(template.exits, directions);

      this.addComponent(template.sprite);
      this.rotation = turns * 90;

      for (var r = 0; r < k.room.height; r++) {
        for (var c = 0; c < k.room.width; c++) {
          var x = c * k.tile.width;
          var y = r * k.tile.height;

          var tileSymbol = this._getTile(r, c, turns, template);

          if (tileSymbol === 'X' || tileSymbol === undefined) {
            this.attach(
              Crafty.e('Wall').attr({
                x: x,
                y: y,
                z: k.layers.obstacles,
              }));
          }/*  else {
            this.attach(
              Crafty.e('Floor').attr({
                x: x,
                y: y,
              }));
            } */
        }
      }

      return this;
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
