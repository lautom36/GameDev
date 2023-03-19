MyGame.storage = (function () {
  'use strict';
  let index = 0;
  let highScores = {};
  let previousScores = localStorage.getItem('MyGame.highScores');
  // console.log('prevScores');
  // console.log(previousScores);

  if (previousScores !== null) {
      highScores = JSON.parse(previousScores);
  }

  function add(value) {
      highScores[index] = value;
      index++;
      localStorage['MyGame.highScores'] = JSON.stringify(highScores);
  }

  function remove(key) {
      delete highScores[key];
      localStorage['MyGame.highScores'] = JSON.stringify(highScores);
  }

  function report() {
      let scores = []

      // console.log('highscores');
      // console.log(highScores);
      for (let key in highScores) {
          scores.push(highScores[key])
      }
      return scores;
  }

  function update(score) {
    // console.log(score);
    let scores = report();

    if (scores.length < 5) {
        add(score);
    } else {
        let lowest = Object.keys(highScores)[0];
    
        // find the smallest value
        for (let key in highScores) {
          if (highScores[key] < highScores[lowest]) {
            lowest = key;
          }
        }
    
        // if the score is highest than the lowest highscore replace it
        if (highScores[lowest] < score) {
            delete highScores[lowest];
            add(score);
        }
    }


  }

  function clear() {
    highScores = {};
    localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    index = 0;
  }

  return {
      add : add,
      remove : remove,
      report : report, 
      update : update,
      clear  : clear
  };
}());