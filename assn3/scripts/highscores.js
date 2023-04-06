MyGame.screens['high-scores'] = (function(game) {
    'use strict';
    
    let elements = []
    elements.push(document.getElementById('score1'));
    elements.push(document.getElementById('score2'));
    elements.push(document.getElementById('score3'));
    elements.push(document.getElementById('score4'));
    elements.push(document.getElementById('score5'));
    
    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

        document.getElementById('high-scores-clear').addEventListener(
            'click',
            function() {
                MyGame.storage.clear();
                // game.showScreen('main-menu');
                for (let i = 0; i < elements.length; i++) {
                    let element = elements[i];
                    element.innerHTML = '---'
                }
            });
        }

        
    function run() {
        let scores = MyGame.storage.report();
        scores.sort(function(a, b) { return b - a;});
        for (let i = 0; i < scores.length; i++) {
            let element = elements[i];
            element.innerHTML = scores[i];
        }
    }   
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
