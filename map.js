/*
 * Builds the map and renders it.
 */
define(['crafty', 'constants', 'map_generator', 'tiles'], function(Crafty, k, map) {

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
      for (var r = 0; r < k.room.width; r++) {
        for (var c = 0; c < k.room.height; c++) {
          var x = r * k.tile.width;
          var y = c * k.tile.height;

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
        }
      }

      this._addDoorIfOpen((k.room.width - 1) / 2, 0,                       k.NORTH, directions);
      this._addDoorIfOpen(k.room.width - 1,       (k.room.height - 1) / 2, k.EAST,  directions);
      this._addDoorIfOpen((k.room.width - 1) / 2, k.room.height - 1,       k.SOUTH, directions);
      this._addDoorIfOpen(0,                      (k.room.height - 1) / 2, k.WEST,  directions);

      return this;
    },

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
  });

});
