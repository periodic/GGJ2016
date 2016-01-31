/*
 * Builds the map and renders it.
 */
define(['crafty', 'constants', 'map_generator', 'data/roomdata', 'tiles'], function(Crafty, k, map, roomData) {

  var DIRECTIONS = [k.NORTH, k.EAST, k.SOUTH, k.WEST];

  Crafty.c('Map', {
    init: function () {
      var rooms = map.generateMap(0,0,3,3);

      var roomWidth = k.room.width * k.tile.width;
      var roomHeight = k.room.height * k.tile.height;

      var baseOffsetX = - roomWidth / 2;
      var baseOffsetY = - roomHeight / 2;

      console.log(rooms);

      for (var r = 0; r < k.map.width; r++) {
        for (var c = 0; c < k.map.width; c++) {
          if (rooms[r][c]) {
            Crafty.e('Room').room(rooms[r][c]).attr({
              x: c * roomWidth + baseOffsetX,
              y: r * roomHeight + baseOffsetY,
            });
          }
        }
      }
    },
  });

  Crafty.c('Room', {
    required: '2D, Canvas',
    init: function () {
      this.attr({
        w: k.tile.width * k.room.width,
        h: k.tile.height * k.room.height,
        x: 0,
        y: 0,
      });
    },
    room: function (directions) {
      var template = this._chooseTemplate(directions);

      // number of turns from template to directions.
      var turns = this._canFitToTemplate(template.exits, directions);

      console.log("Choose directions ", template.exits, " to match ", directions, " in ", turns, " turns");

      for (var r = 0; r < k.room.height; r++) {
        for (var c = 0; c < k.room.width; c++) {
          var x = c * k.tile.width;
          var y = r * k.tile.height;

          var tileSymbol = this._getTile(r, c, turns, template);

          if (tileSymbol === 'X') {
            this.attach(
              Crafty.e('Wall').attr({
                x: x,
                y: y,
              }));
          } else {
            this.attach(
              Crafty.e('Floor').attr({
                x: x,
                y: y,
              }));
          }

          /*
          if (r == 0 || c == 0 || r == k.room.width - 1 || c == k.room.height - 1) {
            if (((r == 0 || r == k.room.width - 1) && c == (k.room.height - 1) / 2) ||
                ((c == 0 || c == k.room.height - 1) && r == (k.room.width - 1) / 2)) {
              // Door, handle it later.
            } else {
              this.attach(
                Crafty.e('Wall').attr({
                  x: x,
                  y: y,
                }));
            }
          } else {
            this.attach(
              Crafty.e('Floor').attr({
                x: x,
                y: y,
              }));
          }
          */
        }
      }

      /*
      this._addDoorIfOpen((k.room.width - 1) / 2, 0,                       k.NORTH, directions);
      this._addDoorIfOpen(k.room.width - 1,       (k.room.height - 1) / 2, k.EAST,  directions);
      this._addDoorIfOpen((k.room.width - 1) / 2, k.room.height - 1,       k.SOUTH, directions);
      this._addDoorIfOpen(0,                      (k.room.height - 1) / 2, k.WEST,  directions);
      */

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

    /*
    _addDoorIfOpen: function (r, c, dir, directions) {
      var x = r * k.tile.width;
      var y = c * k.tile.height;
      if (directions.indexOf(dir) >= 0) {
        this.attach(
          Crafty.e('Floor').attr({
            x: x,
            y: y,
          }));
      } else {
        this.attach(
          Crafty.e('Wall').attr({
            x: x,
            y: y,
          }));
      }
    },
    */

    _chooseTemplate: function (directions) {
      var matchingTemplates = roomData.filter(function (template) {
        return this._canFitToTemplate(directions, template.exits) >= 0;
      }, this);

      if (matchingTemplates.length == 0) {
        console.error("Could not find a matching template for room configuration", directions);
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
