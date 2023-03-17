// let canvas = document.getElementById('id-canvas');
// let context = canvas.getContext('2d'); 
let maze_size = 5;

function clear() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
};
imgFloor.src = 'assets/floor.png';

function drawCell(cell) {

  if (imgFloor.isReady) {
      context.drawImage(imgFloor,
      cell.x * (COORD_SIZE / maze_size), cell.y * (COORD_SIZE / maze_size),
      COORD_SIZE / maze_size + 0.5, COORD_SIZE / maze_size + 0.5);
  }

  if (cell.edges.n === null) {
      context.moveTo(cell.x * (COORD_SIZE / maze_size), cell.y * (COORD_SIZE / maze_size));
      context.lineTo((cell.x + 1) * (COORD_SIZE / maze_size), cell.y * (COORD_SIZE / maze_size));
  }

  if (cell.edges.s === null) {
      context.moveTo(cell.x * (COORD_SIZE / maze_size), (cell.y + 1) * (COORD_SIZE / maze_size));
      context.lineTo((cell.x + 1) * (COORD_SIZE / maze_size), (cell.y + 1) * (COORD_SIZE / maze_size));
  }

  if (cell.edges.e === null) {
      context.moveTo((cell.x + 1) * (COORD_SIZE / maze_size), cell.y * (COORD_SIZE / maze_size));
      context.lineTo((cell.x + 1) * (COORD_SIZE / maze_size), (cell.y + 1) * (COORD_SIZE / maze_size));
  }

  if (cell.edges.w === null) {
      context.moveTo(cell.x * (COORD_SIZE / maze_size), cell.y * (COORD_SIZE / maze_size));
      context.lineTo(cell.x * (COORD_SIZE / maze_size), (cell.y + 1) * (COORD_SIZE / maze_size));
  }
}

function renderCharacter(character) {
  if (character.image.isReady) {
      context.drawImage(character.image,
      character.location.x * (COORD_SIZE / maze_size), 
      character.location.y * (COORD_SIZE / maze_size),
      COORD_SIZE / maze_size + 0.5, 
      COORD_SIZE / maze_size + 0.5);
  }
}

let imgPath = new Image();
imgPath.isReady = false;
imgPath.onload = function() {
    this.isReady = true;
};
imgPath.src = 'assets/path.png';


let renderShortestPath = (path) => {
  for(i = 1; i < path.length; i++) {
    let cell = path[i];
    if (imgPath.isReady) {
      context.drawImage(imgPath,
        cell.x * (COORD_SIZE / maze_size) + maze_size / 2, 
        cell.y * (COORD_SIZE / maze_size) + maze_size / 2,
        COORD_SIZE / maze_size / 2 + 0.5, 
        COORD_SIZE / maze_size / 2 + 0.5);
    }
  }
}

let renderHint = (cell) => {
  if (imgPath.isReady) {
    context.drawImage(imgPath,
      cell.x * (COORD_SIZE / maze_size) + maze_size / 2, 
      cell.y * (COORD_SIZE / maze_size) + maze_size / 2,
      COORD_SIZE / maze_size / 2 + 0.5, 
      COORD_SIZE / maze_size / 2 + 0.5)
  }
}

let imgCrumb = new Image();
imgCrumb.isReady = false;
imgCrumb.onload = function() {
    this.isReady = true;
};
imgCrumb.src = 'assets/breadCrumb.png';

let renderBreadCrumbs = (path) => {
  for(i = 0; i < path.length; i++) {
    let cell = path[i];
    if (imgCrumb.isReady) {
      context.drawImage(imgCrumb,
        cell.x * (COORD_SIZE / maze_size) + maze_size / 2, 
        cell.y * (COORD_SIZE / maze_size) + maze_size / 2,
        COORD_SIZE / maze_size / 2 + 0.5, 
        COORD_SIZE / maze_size / 2 + 0.5)
    }
  }
}

  
let imgFinish = new Image();
imgFinish.isReady = false;
imgFinish.onload = function() {
    this.isReady = true;
};
imgFinish.src = 'assets/finish.png';

function renderMaze(maze) {
  // Render the cells first
  maze_size = maze.length;
  context.beginPath();
  for (let row = 0; row < maze_size; row++) {
      for (let col = 0; col < maze_size; col++) {
          drawCell(maze[row][col]);
      }
  }

  if (imgFinish.isReady) {
    let last = maze[maze_size - 1][maze_size - 1];
    context.drawImage(imgFinish,
      last.x * (COORD_SIZE / maze_size), 
      last.y * (COORD_SIZE / maze_size),
      COORD_SIZE / maze_size + 0.5, 
      COORD_SIZE / maze_size + 0.5)
  }

  context.strokeStyle = 'rgb(255, 255, 255)';
  context.lineWidth = 6;
  context.stroke();

  // Draw a black border around the whole maze
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(COORD_SIZE - 1, 0);
  context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
  context.lineTo(0, COORD_SIZE - 1);
  context.closePath();
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.stroke();

}