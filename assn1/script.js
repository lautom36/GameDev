// get html things
const eventsContainer = document.getElementById('EventContainer');
const nameInput = document.getElementById('NameInput');
const intervalInput = document.getElementById('IntervalInput');
const NOTInput = document.getElementById('NOTInput');
const button = document.getElementById('Button');

eventsContainer.scrollTop = 100;
eventsContainer.scrollHeight = 100;

// create queue for events
// const inputBuffer = [];
const queue = [];
const printStack = [];

// create event template
const createEvent = (name, interval, NOT) => {
  const event = {
    name: name,
    interval: interval,
    numberLeft: NOT,
    timeTillNext: 0,
  }

  return event;
}

const updateEvent = (event) => {
 event.numberLeft -= 1;
 event.timeTillNext = event.interval;

 return event;
}

const eventToString = (event) => {
  return `Event: ${event.name} (${event.numberLeft - 1} remaining)\n`;
}

// add onClick to button
const onClick = () => {
  console.log("button clicked");
  const newEvent = createEvent(nameInput.value, intervalInput.value, NOTInput.value);
  queue.push(newEvent);
}

button.addEventListener("click", onClick);

// game loop stuff
// const processInput = (elapsedTime) => {
  
// }

const update = (elapsedTime) => {
  // console.log("elapsedTime: ", elapsedTime);
  console.log(queue);
  for(i = 0; i < queue.length; i++) {
    let currEvent = queue[i];
    if (currEvent.timeTillNext <= 0 && currEvent.numberLeft > 0) { // if the event is ready to execute
      printStack.push(eventToString(currEvent)); // push to print stack
      console.log("numberLeft before: ", currEvent.numberLeft);
      currEvent = updateEvent(currEvent);  // update event
      console.log("numberLeft after: ", currEvent.numberLeft);
    }
    else {
      currEvent.timeTillNext -= elapsedTime;
    }
    queue[i] = currEvent;

    if (currEvent.numberLeft <= 0) {
      queue.splice(i, 1);
    }
  }
}

const render = () => {
  for (i = 0; i < printStack.length; i++) {
    eventsContainer.innerHTML += printStack[i];
    eventsContainer.scrollTop += 64;
  }
  printStack.length = 0;
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