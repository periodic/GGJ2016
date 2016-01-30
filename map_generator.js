/*
 * Generate a map!
 */
define(['constants'], function (k) {

  var NORTH = 0;
  var EAST = 1;
  var SOUTH = 2;
  var WEST = 3;

  function emptyExitGrid() {
    var rows = [];
    for (var r = 0; r < k.map.height * 2 - 1; r++) {
      var row_length = k.map.width;
      if (r % 2 == 0) row_length = k.map.width - 1;
      rows[r] = [];
      for (var c = 0; c < row_length; c++) {
        rows[r].push(true);
      }
    }
    return rows;
  }

  function exitsFor(r, c, exitGrid) {
    var exits = [];

    if (exitGrid[2*r - 1] && exitGrid[2*r - 1][c]) exits.push(NORTH);
    if (exitGrid[2*r + 1] && exitGrid[2*r + 1][c]) exits.push(SOUTH);
    if (exitGrid[2*r    ] && exitGrid[2*r    ][c]) exits.push(EAST);
    if (exitGrid[2*r    ] && exitGrid[2*r    ][c - 1]) exits.push(WEST);

    return exits;
  }

  function getCoordFor(r, c, direction) {
    if (direction == NORTH)
      return [r - 1, c];
    if (direction == EAST)
      return [r, c + 1];
    if (direction == SOUTH)
      return [r + 1, c];
    if (direction == WEST)
      return [r, c - 1];
    return [r, c];
  }

  function reachable(r, c, exitGrid) {
    // Boring DFS.
    var stack = [[r,c]];
    var tileGrid = [];

    for (var r = 0; r < k.map.height; r++) {
      tileGrid[r] = [];
      for (var c = 0; c < k.map.width; c++) {
        tileGrid[r].push(false);
      }
    }

    while (stack.length > 0) {
      var curr = stack.pop();
      var r = curr[0];
      var c = curr[1];

      console.log("Visting ", r, c);
      tileGrid[r][c] = true;

      var exits = exitsFor(r, c, exitGrid);

      var neighbors = exits.map(function (dir) {
        return getCoordFor(r, c, dir);
      });

      neighbors.forEach(function (neighbor) {
        var r = neighbor[0];
        var c = neighbor[1];
        if (!tileGrid[r][c])
          stack.push(neighbor);
      });
    }

    return tileGrid;
  }

  function removeRandomExit(originR, originC, targetR, targetC, exitGrid) {
    var maxR = (k.map.height - 1) * 2;
    var r = Math.floor(Math.random() * maxR);
    if (r % 2 == 0) {
      var maxC = k.map.width - 2;
    } else {
      var maxC = k.map.width - 1;
    }
    var c = Math.floor(Math.random() * maxC);

    console.log("Removing: ", r, c);
    exitGrid[r][c] = false;

    var reachableTiles = reachable(originR, originC, exitGrid);

    if (!reachableTiles[targetR][targetC]) {
      exitGrid[r][c] = true;
      return false;
    } else {
      return true;
    }
  }

  function trimMap(originR, originC, targetR, targetC, exitGrid) {
    var numExits = (k.map.width - 1) * k.map.height
                 + (k.map.width) * (k.map.height + 1);

    var exitsToRemove = (1 - k.map.connectedness) * numExits;

    for (var i = 0; i < exitsToRemove; i++) {
      removeRandomExit(originR, originC, targetR, targetC, exitGrid);
    }
  }

  function convertToTiles(originR, originC, exitGrid) {
    var reachableTiles = reachable(originR, originC, exitGrid);
    for (var r = 0; r < k.map.width; r++) {
      for (var c = 0; c < k.map.width; c++) {
        if (reachableTiles[r][c]) {
          reachableTiles[r][c] = exitsFor(r, c, exitGrid);
        }
      }
    }
    return reachableTiles;
  }

  function generateMap(originR, originC, targetR, targetC) {
    var exitGrid = emptyExitGrid();
    trimMap(originR, originC, targetR, targetC, exitGrid);
    return convertToTiles(originR, originC, exitGrid);
  }

  return {
    NORTH: NORTH,
    EAST: EAST,
    SOUTH: SOUTH,
    WEST: WEST,

    /*
    emptyExitGrid : emptyExitGrid,
    exitsFor: exitsFor,
    reachable: reachable,
    removeRandomExit: removeRandomExit,
    trimMap: trimMap,
    */
    generateMap: generateMap,
  };
});
