/*
 * Room definitions.
 *
 * Each room should have:
 *  exits: a list of the exits for the room.
 *  backgroundFile: The file the image for the background is in.
 *  x: The x-position in the grid of rooms for this specific room's image.
 *  y: The y-position in the grid of rooms for this specific room's image.
 *  room: an ascii-art representation of the room.
 */
define(['constants'], function (k) {
  return [{
    exits: [k.SOUTH],
    backgroundFile: "assets/rooms.png",
    x: 0,
    y: 0,
    room: [
      // This example room is 13x13 and really boring.
      "XXXXXXXXXXXXX",
      "X           X",
      "X           X",
      "X           X",
      "X           X",
      "X           X",
      "X           X",
      "X           X",
      "X           X",
      "XXXXXX XXXXXX",
    ],
  }];
});
