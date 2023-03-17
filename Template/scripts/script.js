// game loop stuff
// const processInput = (elapsedTime) => {
  
// }

const update = (elapsedTime) => {

}

const render = () => {

}

let prevTime = performance.now();
const gameLoop = (timeStamp) => {
  elapsedTime = timeStamp - prevTime;
  prevTime = timeStamp;
  // processInput(elapsedTime); // look for new inputs in buffer and add them to queue
  update(elapsedTime); // remove expired events and add event to print stack if ready
  render(); // add any events in print stack to the event container
  requestAnimationFrame(gameLoop);
}

gameLoop()