// get html elements
const timeValue = document.getElementById('timeValue');
const scoreValue = document.getElementById('scoreValue');
const button5 = document.getElementById('5Button');
const button10 = document.getElementById('10Button');
const button15 = document.getElementById('15Button');
const button20 = document.getElementById('20Button');
const hS5 = document.getElementById('5HS');
const hS10 = document.getElementById('10HS');
const hS15 = document.getElementById('15HS');
const hS20 = document.getElementById('20HS');

let solved = false;
let inputBuffer = {};
let canvas = null;
let context = null;
let maze = null;
let myCharacter = null;
let showHint = false; 
let showAnswer = false; 
let showBreadCrumb = false;
let answer = [];
let removed = [];
let breadCrumbs = [];
let lock = false;
let mazeSize = 10;
let totalTime = 0;
let totalScore = 0;
let scoreTracker = [];
let highScores = {5: 0, 10: 0, 15: 0, 20: 0};

const COORD_SIZE = 1000;

const onClick5 = () => {
  mazeSize = 5;
  initialize()
}
button5.addEventListener('click', onClick5);

const onClick10 = () => {
  mazeSize = 10;
  initialize()
}
button10.addEventListener('click', onClick10);

const onClick15 = () => {
  mazeSize = 15;
  initialize()
}
button15.addEventListener('click', onClick15);

const onClick20 = () => {
  mazeSize = 20;
  initialize()
}
button20.addEventListener('click', onClick20);

function doInput(key, character) {
  console.log(`${key} pressed`);
  if (key === 'ArrowDown' || key == 's' || key == 'k') {
      if (character.location.edges.s) {
          character.location = character.location.edges.s;
      }
  }
  else if (key == 'ArrowUp' || key == 'w' || key == 'i') {
      if (character.location.edges.n) {
          character.location = character.location.edges.n;
      }
  }
  else if (key == 'ArrowRight' || key == 'd' || key == 'l') {
      if (character.location.edges.e) {
          character.location = character.location.edges.e;
      }
  }
  else if (key == 'ArrowLeft' || key == 'a' || key == 'j') {
      if (character.location.edges.w) {
          character.location = character.location.edges.w;
      }
  }
  else if (key == 'h') {
    showHint = !showHint;
    showAnswer = false;
  }
  else if (key == 'b') {
    showBreadCrumb = !showBreadCrumb;
  }
  else if (key == 'p') {
    showAnswer = !showAnswer;
    showHint = false;
  }
  // else if (key == 'r') {
  //   myCharacter.location = maze[0][0];
  //   breadCrumbs = [];
  //   for (i = 0; i < removed.length; i++) {
  //     answer.push(removed.pop());
  //   }
  //   solved = false;
  //   totalTime = 0;
  //   totalScore = 0;
  //   scoreTracker = answer;
  //   console.log(scoreTracker);
  // }
  // console.log(character.location);
}

let updateShortestPath = () => {
  let loc = myCharacter.location;
  console.log(lock);

  // steped on a shortest path
  if (answer.includes(loc)) {
    removed.push(answer.pop());
    lock = false;
  } 
  // 
  else if (removed.includes(loc)) {
    if (removed.length > 0 && removed[removed.length-1] !== loc && !lock) {
      answer.push(removed.pop());
    }
  } else {
    if (removed.length > 0 && !lock) {
      answer.push(removed.pop());
      lock = true;
    }
  }
}

const updateScore = () => {
  let loc = myCharacter.location;

  // steped on a shortest path
  if (solved == false) {
    if (scoreTracker.includes(loc)) {
      let index = scoreTracker.indexOf(loc);
      scoreTracker.splice(index , 1);
      totalScore += 5;
    } 
    else {
      if (!breadCrumbs.includes(loc)) {
        totalScore -= 1;
      }
    }
  
    if (loc == maze[mazeSize-1][mazeSize-1]) {
      solved = true;
      console.log(highScores);
      if (highScores[mazeSize] < totalScore) { 
        highScores[mazeSize] = totalScore;
        console.log(highScores);
      }
      
      hS5.textContent = highScores[5];
      hS10.textContent = highScores[10];
      hS15.textContent = highScores[15];
      hS20.textContent = highScores[20];
    }
  }
}

let updateBreadCrumbs = () => {
  let loc = myCharacter.location;
  if (!breadCrumbs.includes(loc)) { 
    breadCrumbs.push(loc); 
  }
}

// game loop
function processInput() {
  for (input in inputBuffer) {
      doInput(inputBuffer[input], myCharacter);
  }
  inputBuffer = {};
}

const update = (elapsedTime) => {
  // update score
  updateScore();
  if (!solved) {
    totalTime += elapsedTime;
  }
  timeValue.textContent = Math.floor((totalTime/1000) % 60);
  scoreValue.textContent = totalScore;
  // update shortest path
  updateShortestPath();
  updateBreadCrumbs();
  // update hint
}

const render = () => {
  renderMaze(maze);
  if (showBreadCrumb) {
    // render bread crumb
    renderBreadCrumbs(breadCrumbs);
  } else if (showHint) {
    // render hint
    if (answer.length > 0) {
      renderHint(answer[answer.length-1]);
    }
  } else if (showAnswer) {
    // render answer
    renderShortestPath(answer);
  }
  renderCharacter(myCharacter);
  //TODO: show start and end points
}

let prevTime = performance.now();
const gameLoop = (timeStamp) => {
  elapsedTime = timeStamp - prevTime;
  prevTime = timeStamp;
  processInput(elapsedTime); // look for new inputs in buffer and add them to queue
  update(elapsedTime); // remove expired events and add event to print stack if ready
  render(); // add any events in print stack to the event container
  requestAnimationFrame(gameLoop);
}

function initialize() {
  canvas = document.getElementById('canvas-main');
  context = canvas.getContext('2d');

  maze = mazeGen(mazeSize);
  ({ maze, character, shortestPath } = maze.createMaze());
  myCharacter = character;
  answer = shortestPath;
  scoreTracker = [...shortestPath];
  totalScore = 0;
  totalTime = 0;
  solved = false;

  
  window.addEventListener('keyup', function(event) {
    inputBuffer[event.key] = event.key;
  });
  
  requestAnimationFrame(gameLoop);
}