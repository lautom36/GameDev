let mazeGen = function(size){

  let myCharacter = function(imageSource, location) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return {
        location: location,
        image: image
    };
  };

  let initialize = () => {
    let maze = [];
    for (let row = 0; row < size; row++) {
        maze.push([]);
        for (let col = 0; col < size; col++) {
            maze[row].push({
                x: col, y: row, edges: {
                    n: null,
                    s: null,
                    w: null,
                    e: null
                }, visited: false, distance: Infinity
            });
        }
    }
    return maze;
  }

  let updateEdges = (edge) => {
    // MAZE IS [ROW] [COLUMN]
    // x -> col y -> row
    
    // context is from -> to
    // north: column the same, row one less
    // south: column the same, row one more
    // east:  column one less, row the same
    // west:  column one more, row the same
    // console.log('edge: ', edge);
    let {to, from} = edge;
    // console.log('from: ', from);
    // console.log('to: ', to);

    // north or south
    if (to.x === from.x) {
      // north
      if (to.y < from.y) {
        from.edges.n = to;
        to.edges.s = from;
      }
      // south
      else {
        from.edges.s = to;
        to.edges.n = from;
      }
    } 
    // east or west
    else {
      // east
      if (to.x > from.x) {
        from.edges.e = to;
        to.edges.w = from;
      }
      // west
      else {
        from.edges.w = to;
        to.edges.e = from;
      }
    }
  }

  let prims = (initMaze) => {
    // MAZE IS [ROW] [COLUMN]
    let wallsToDraw = [];
    let walls = [];
    let inMaze = [];

    // add first cell to lists
    inMaze.push(initMaze[0][0]);
    walls.push({ to: initMaze[1][0], from: initMaze[0][0] })
    walls.push({ to: initMaze[0][1], from: initMaze[0][0] })

    while (walls.length > 0) {
      for (i = 0; i < walls.length; i++) {
        wall = walls[i]
      }
      // pick random wall
      randomIndex = Math.floor(Math.random() * walls.length);
      let currWall = walls[randomIndex];
      let to = currWall.to;
      let from = currWall.from;
      // if only one cell from the wall is in maze
      //TODO: might be able to say only if to cell is not in maze
      if ((inMaze.indexOf(to) < 0 || inMaze.indexOf(from) < 0) && !(inMaze.indexOf(to) < 0 && inMaze.indexOf(from) < 0)) {
        // put cell in maze
        updateEdges(currWall);
        inMaze.push(to);
        // add new cells walls to list
        let x = to.x;
        let y = to.y;

        // add wall to the left
        if (x - 1 >= 0) {
          let next = initMaze[y][x-1];
          if (inMaze.indexOf(next) < 0) {
            walls.push({ from: to, to: next });
          }
        }
        // add wall to the right
        if (x + 1 < initMaze.length) {
          let next = initMaze[y][x+1]
          if (inMaze.indexOf(next) < 0) {
            walls.push({ from: to, to: next });
          }
        }
        // add wall up
        if (y - 1 >= 0) {
          let next = initMaze[y - 1][x]
          if (inMaze.indexOf(next) < 0) {
            walls.push({ from: to, to: next });
          }
        }
        // add wall down
        if (y + 1 < initMaze.length) {
          let next = initMaze[y + 1][x]
          if (inMaze.indexOf(next) < 0) {
            walls.push({ from: to, to: next });
          }
        }

      }
      walls.splice(randomIndex, 1);
    }
    return initMaze; 
  }

  let shortestPath = (maze) => {
    // MAZE IS [ROW] [COLUMN]
    // x -> col y -> row
    let start = maze[0][0];
    let end = maze[size-1][size-1];
    const visited = new Array(size).fill().map(() => new Array(size).fill(false));

    const queue = [];
    visited[0][0] = true;
    maze[0][0].visited = true;

    const distance = [];
    for (let i = 0; i < size; i++) {
      distance[i] = [];
      for (let j = 0; j < size; j++) {
        distance[i][j] = Infinity;
      }
    }
    distance[0][0] = 0;
    maze[0][0].distance = 0;

    let edges = start.edges;
    if (edges.n !== null) {
      queue.push({ from: {x: 0, y: 0 }, to: {x: edges.n.x, y: edges.n.y }});
    }
    if (edges.s !== null) {
      queue.push({ from: {x: 0, y: 0 }, to: {x: edges.s.x, y: edges.s.y }});
    }
    if (edges.e !== null) {
      queue.push({ from: {x: 0, y: 0 }, to: {x: edges.e.x, y: edges.e.y }});
    }
    if (edges.w !== null) {
      queue.push({ from: {x: 0, y: 0 }, to: {x: edges.w.x, y: edges.w.y }});
    }
    while (queue.length > 0) {
      const { to, from } = queue.shift();
      if (to.x === end.x && to.y === end.y) {
        distance[to.y][to.x] = distance[from.y][from.x] + 1;
        maze[to.y][to.x].distance = distance[from.y][from.x] + 1;

        visited[to.y][to.x] = true;
        maze[to.y][to.x].visited = true;
        // return distance[end.y][end.x];
      } else if (!visited[to.y][to.x]) {
        // update distance
        distance[to.y][to.x] = distance[from.y][from.x] + 1;
        maze[to.y][to.x].distance = distance[from.y][from.x] + 1;
        // update visited
        visited[to.y][to.x] = true;
        maze[to.y][to.x].visited = true;
        // add edges
        edges = maze[to.y][to.x].edges;
      
        if (edges.n != null) {
          queue.push({ from: {x: to.x, y: to.y }, to: {x: edges.n.x, y: edges.n.y }})
        }
        if (edges.s != null) {
          queue.push({ from: {x: to.x, y: to.y }, to: {x: edges.s.x, y: edges.s.y }})
        }
        if (edges.e != null) {
          queue.push({ from: {x: to.x, y: to.y }, to: {x: edges.e.x, y: edges.e.y }})
        }
        if (edges.w != null) {
          queue.push({ from: {x: to.x, y: to.y }, to: {x: edges.w.x, y: edges.w.y }})
        }
      }
    }
    let route = [maze[size-1][size-1]];
    let solved = false;
    let  count = 0

    while (!solved || count < 10000) {
      count += 1;
      let currCell = route[route.length-1];
      if (currCell === maze[0][0]){
        break;
      }

      let edges = currCell.edges;
      let best = null;

      if (edges.n !== null) {
          best = edges.n;
      }
      if (edges.s !== null) {
        if (best === null) {
          best = edges.s;
        } else {
          if (edges.s.distance < best.distance) {
            best = edges.s;
          }
        }
      }
      if (edges.e !== null) {
        if (best === null) {
          best = edges.e;
        } else {
          if (edges.e.distance < best.distance) {
            best = edges.e;
          }
        }
      }
      if (edges.w !== null) {
        if (best === null) {
          best = edges.w;
        } else {
          if (edges.w.distance < best.distance) {
            best = edges.w;
          }
        }
      }
      route.push(best);
    }
    return route;

    
  }

  let createMaze = () => {
    console.log('making maze');
    let initMaze = initialize();
    let randMaze = prims(initMaze);
    let character = myCharacter('assets/character.png', randMaze[0][0]);
    let path = shortestPath(randMaze);
      return { maze: randMaze, shortestPath: path, character: character };
  }

  return { createMaze: createMaze }

};