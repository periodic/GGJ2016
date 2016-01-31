/*
 * Generate a map!
 */
define(['constants'], function (k) {

  function emptyMap(height, width, originR, originC, targetR, targetC) {
    var rows = [];
    for (var r = 0; r < height * 2 - 1; r++) {
      var row_length = width;
      if (r % 2 == 0) row_length = width - 1;
      rows[r] = [];
      for (var c = 0; c < row_length; c++) {
        rows[r].push(true);
      }
    }
    return {
      exitGrid: rows,
      width: width,
      height: height,
      originR: originR,
      originC: originC,
      targetR: targetR,
      targetC: targetC,
    };
  }

  function exitsFor(r, c, map) {
    var exits = [];

    var grid = map.exitGrid;

    if (grid[2*r - 1] && grid[2*r - 1][c]) exits.push(k.NORTH);
    if (grid[2*r + 1] && grid[2*r + 1][c]) exits.push(k.SOUTH);
    if (grid[2*r    ] && grid[2*r    ][c]) exits.push(k.EAST);
    if (grid[2*r    ] && grid[2*r    ][c - 1]) exits.push(k.WEST);

    return exits;
  }

  function getCoordFor(r, c, direction) {
    if (direction == k.NORTH)
      return [r - 1, c];
    if (direction == k.EAST)
      return [r, c + 1];
    if (direction == k.SOUTH)
      return [r + 1, c];
    if (direction == k.WEST)
      return [r, c - 1];
    return [r, c];
  }

  function reachable(map) {
    // Boring DFS.
    var stack = [[map.originR,map.originC]];
    var tileGrid = [];

    for (var r = 0; r < map.height; r++) {
      tileGrid[r] = [];
      for (var c = 0; c < map.width; c++) {
        tileGrid[r].push(false);
      }
    }

    while (stack.length > 0) {
      var curr = stack.pop();
      var r = curr[0];
      var c = curr[1];

      tileGrid[r][c] = true;

      var exits = exitsFor(r, c, map);

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

  function removeRandomExit(map) {
    var maxR = (map.height - 1) * 2;
    var r = Math.floor(Math.random() * maxR);
    if (r % 2 == 0) {
      var maxC = map.width - 2;
    } else {
      var maxC = map.width - 1;
    }
    var c = Math.floor(Math.random() * maxC);

    map.exitGrid[r][c] = false;

    var reachableTiles = reachable(map);

    if (!reachableTiles[map.targetR][map.targetC]) {
      map.exitGrid[r][c] = true;
      return false;
    } else {
      return true;
    }
  }

  function trimMap(map) {
    var numExits = (map.width - 1) * map.height
                 + (map.width) * (map.height + 1);

    var exitsToRemove = (1 - k.map.connectedness) * numExits;

    for (var i = 0; i < exitsToRemove; i++) {
      removeRandomExit(map);
    }
  }

  function convertToTiles(map) {
    var reachableTiles = reachable(map);
    for (var r = 0; r < map.height; r++) {
      for (var c = 0; c < map.width; c++) {
        if (reachableTiles[r][c]) {
          reachableTiles[r][c] = exitsFor(r, c, map);
        }
      }
    }
    return reachableTiles;
  }

  function generateMap(height, width, originR, originC, targetR, targetC) {
    var map = emptyMap(height, width, originR, originC, targetR, targetC);
    trimMap(map);
    return convertToTiles(map);
  }

  return {
    generateMap: generateMap,
  };
});
