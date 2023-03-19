MyGame.screens['pause'] = (function(game) {
  'use strict';
  
  
  function initialize() {
    document.getElementById('exit-game').addEventListener(
      'click',
      function() { 
        game.showScreen('main-menu'); 
        localStorage['MyGame.state'] = JSON.stringify({state: false}); });

      document.getElementById('continue').addEventListener(
        'click',
        function() { game.showScreen('game-play'); });
  }

      
  function run() {
  }   
  
  return {
      initialize : initialize,
      run : run
  };
}(MyGame.game));
