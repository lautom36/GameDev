MyGame.screens['game-play'] = (function(game, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let particles = [];
    let platforms = []; // list of lists where each interior list has two memebers
    let preview  = [];
    let player = null;
    let timeTillNext = 0;
    let scoresUpdated = false;
    let score = 0;
    let done = false;
       

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        let state = JSON.parse(localStorage.getItem('MyGame.state'));
        if (!state.state) {
            localStorage['MyGame.state'] = JSON.stringify({state: true});
            resetState();
        }
        if (!done) {
            timeTillNext -= elapsedTime;
            // update platforms
            updatePlatforms(elapsedTime);
            checkHit();
            
            // update time
            score += elapsedTime;
        }
        updateParticles(elapsedTime);

    }

    function render() {
        // clear the graphics
        MyGame.graphics.clear();

        // render full background


        // render background
        MyGame.graphics.drawBackground();

        // render platforms
        renderPlatforms();

        // render preview
        MyGame.graphics.drawPlatform(preview.spec);

        // render particles
        renderParticles();

        // render player
        if (!done) {
            MyGame.graphics.drawRectangle(player.spec);
        }

        // render time
        renderScore();
        if (done) {
            renderEnding();
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        // create a player
        player = MyGame.player();
            
        // create preview
        preview = MyGame.platform({center : {x: getNextCenter(750/2, 100)}});

        // register inputs

        myKeyboard.register('Escape', function() {
            cancelNextRequest = true;
            game.showScreen('pause');
        });
        myKeyboard.register('a', player.moveLeft);

        myKeyboard.register('d', player.moveRight);

    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

    function createParticles(spec) {
        let center = spec.center;

        let leftBound = center.x - spec.gapSize / 2;
        let leftWidth = leftBound;
        let left = {
            center: {x: leftWidth / 2 , y: center.y}, 
            width: leftWidth,
            height: spec.height,
            offset: spec.height,
            color: 'green',
            direction: {x: 0, y: 0}  
        }

        let particle = MyGame.particles(left);
        particle.createParticles();
        particles.push(particle);

        let rightBound = center.x + spec.gapSize / 2;
        let rightWidth = 750 - rightBound;
        let right = {
            center: {x: rightBound + rightWidth / 2 , y: center.y }, 
            width: rightWidth,
            height: spec.height,
            offset: spec.height,
            color: 'green',
            direction: {x: 0, y: 0} 
        }
        particle = MyGame.particles(right);
        particle.createParticles();
        particles.push(particle);
    }

    function renderParticles() {
        for( let i = 0; i < particles.length; i++){
            let currParticle = particles[i];
            Object.getOwnPropertyNames(currParticle.particles).forEach( function(value) {
                let particle = currParticle.particles[value];
                MyGame.graphics.drawParticle(particle);
            });
        }
    }

    function updateParticles(elapsedTime) {
        for( let i = 0; i < particles.length; i++){
            let currParticle = particles[i];
            currParticle.update(elapsedTime);
        }
    }

    function updatePlatforms(elapsedTime) {
        // move the platforms
        for (let i = 0; i < platforms.length; i++) {
            platforms[i].update(elapsedTime);
            createParticles(platforms[i].spec);
        }

        // add new preview
        if (platforms.length < 6 && timeTillNext <= 0) {
            let temp = MyGame.platform({center : {x: getNextCenter(preview.spec.center.x, preview.spec.gapSize)}});
            preview.spec.fillColor= 'purple';
            platforms.push(preview);
            preview = temp;
            timeTillNext = 500;


        }

        // kill old platforms
        let toKill = [];
        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            if (platform.spec.center.y > 750 - 15/2) { toKill.push(platform); }
        }

        for (let i = 0; i < toKill.length; i++) {
            let index = platforms.indexOf(toKill[i]);
            if (index >= 0) {
                platforms.splice(index, 1);
            }
        }
    }

    function renderPlatforms() {
        for( let i = 0; i < platforms.length; i++) {
            MyGame.graphics.drawPlatform(platforms[i].spec);
        }
    }

    function getNextCenter(x, width) {
        let percent = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
        let direction = Math.random() < 0.5 ? 1 : -1;
        if (x < 50) {
            direction = -1
        }else if (x > 700) {
            direction = 1;
        }
        let offset = width * (percent / 100);
        return x + (direction * offset);
    }

    function renderScore() {

        MyGame.graphics.drawText({
            font: 'small-caps 24px arial',
            fillStyle: 'white', 
            strokeStyle: 'white',
            position: {x: 850, y: 10},
            text: `score: ${(score / 1000).toFixed(2)}`
        });
    }

    function checkHit() {
        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            if (player.spec.center.y - player.spec.height/2 < platform.spec.center.y + platform.spec.height/2) {
                let insideLeft = player.spec.center.x - player.spec.width / 2 > platform.spec.center.x - platform.spec.gapSize / 2;
                let insideRight = player.spec.center.x + player.spec.width / 2 < platform.spec.center.x + platform.spec.gapSize / 2;
                if (!insideLeft || !insideRight) {
                    done = true;
                    renderEnding();

                    let spec = {
                        center: player.spec.center, 
                        width: player.spec.width,
                        height: player.spec.height,
                        offset: 0,
                        color: player.spec.fillColor,
                        direction: {x: 0, y: 1},  
                    }

                    let particle = MyGame.particles(spec);
                    particle.createParticles();
                    particles.push(particle);
                }
            }
        }
    }

    function updateTopScores() {
        MyGame.storage.update((score / 1000).toFixed(2));
        scoresUpdated = true;
    }

    function renderEnding() {
        if (!scoresUpdated) {
            updateTopScores();
            scoresUpdated = true;
        }
        MyGame.graphics.drawText({
            font: 'small-caps 128px arial',
            fillStyle: 'white', 
            strokeStyle: 'black',
            position: {x: 750/2, y: 750 / 2 - 128},
            text: `Game Over`
        });

        MyGame.graphics.drawText({
            font: 'small-caps 100px arial',
            fillStyle: 'white', 
            strokeStyle: 'black',
            position: {x: 750/2, y: 750 / 2},
            text: `score: ${(score / 1000).toFixed(2)}`
        });
    }

    function resetState () {
        myKeyboard = input.Keyboard();
        particles = [];
        platforms = []; // list of lists where each interior list has two memebers
        preview  = [];
        player = null;
        timeTillNext = 0;
        scoresUpdated = false;
        score = 0;
        done = false;
        initialize();
    }

}(MyGame.game, MyGame.input));
