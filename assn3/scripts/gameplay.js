MyGame.screens['game-play'] = (function(game, input) {
    'use strict';

    // TODO: [5  points] add shrink animation
    // TODO: [5  points] add another ball at 100 points
    // TODO: [3  points] add music

    let todo = [
        'TODO: add shrink animation',
        'TODO: add another ball at 100 points',
        'TODO: add music', 
    ];
    for (let i = 0; i < todo.length; i++){ console.log(todo[i]); }

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let particles = [];
    let bricks = [];
    let paddle = null;
    let balls = [];
    let scoresUpdated = false;
    let countDown = true;
    let firstTop = true;
    let paused = true;
    let countDownLeft = 3000;
    let nextBall = 100;
    let rowCount = 8;
    let score = 0;
    let lives = 3;
       

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        let state = JSON.parse(localStorage.getItem('MyGame.state'));
        if (!state.state) {
            localStorage['MyGame.state'] = JSON.stringify({state: true});
            resetState();
        }


        if (lives > 0) {

            if (!paused) {
                let toDelete = [];
                for (let i = 0; i < balls.length; i++) {
                    let ball = balls[i];
                    let dead = ball.update(paddle, bricks);
                    if (dead) { lives -= 1; toDelete.push(balls[i]); }

                }
                checkBricks();
                updateParticles(elapsedTime);

                for (let i = 0; i < toDelete.length; i++) {
                    let index = balls.indexOf(toDelete[i]);
                    balls.splice(index, 1);
                }

                if (lives > 0  && balls.length === 0) {
                    let ball = new MyGame.ball('white');
                    balls.push(ball);
                }
            }
    
    
            if (countDown) {
                countDownLeft -= elapsedTime;
                if (countDownLeft < 0) {
                    countDown = false;
                    paused = false;
                    countDownLeft = 3000;
                    // ball.spec.dead = false;
                }
            }
        }
        else if (!scoresUpdated) { updateTopScores(); }
    }

    function render() {
        MyGame.graphics.clear();

        // background
        MyGame.graphics.drawBackground();

        // render bricks
        renderBricks();

        // render particles
        renderParticles();

        // render paddle
        MyGame.graphics.drawRectangle(paddle.spec);

        // render score
        renderScore();

        // render lives
        renderLives();

        // render balls
        if (lives > 0) {
            for (let i = 0; i < balls.length; i++) {
                let ball = balls[i];
                MyGame.graphics.drawCircle(ball.spec);
            }
        }
        else { 
            renderEnding();
        }
        

        if (countDown) {
            renderCountdown();
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
        // create a paddle
        paddle = MyGame.paddle();
            
        // create bricks
        makeBricks();

        //create a ball
        let ball = new MyGame.ball('white');
        balls.push(ball);

        

        // register inputs
        myKeyboard.register('Escape', function() {
            cancelNextRequest = true;
            game.showScreen('pause');
        });

        myKeyboard.register('a', paddle.moveLeft);

        myKeyboard.register('d', paddle.moveRight);

        let state = JSON.parse(localStorage.getItem('MyGame.state'));

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

    function makeBricks() {
        let colors = ['green', 'green', 'blue', 'blue', 'orange', 'orange', 'yellow', 'yellow'];
        let value = [5, 5, 3, 3, 2, 2, 1, 1];
        let width = 50;
        let height = 25;
        let xOffset = width / 2;
        let yOffset = 150;
        for (let row = 0; row < 8; row++){
            let rowList = []
            for (let column = 0; column < 750 / width; column++) {
                let tempWall = MyGame.brick({
                    center:{x: xOffset  + column * width, y: yOffset + row * height}, 
                    fillColor: colors[row],
                    outlineColor: 'white',
                    width: width,
                    height: height,
                    value: value[row],
                    breakable: false,});
                    rowList.push(tempWall);
            }
            bricks.push(rowList);
        }
        rowCount = bricks.length;
    }

    function checkBricks() {
        let toRemove = [];
        for (let row = 0; row < bricks.length; row++) {
            let rowList = bricks[row];
            for (let column = 0; column < rowList.length; column++) {
                let brick = rowList[column];
                if (brick.spec.hit) {
                    score += brick.spec.value;

                    if (brick.spec.value === 5 && firstTop && row < 1) {
                        firstTop = false;
                        paddle.spec.width = paddle.spec.width / 2;
                    }
                    let particle = MyGame.particles({ 
                        center: { x: brick.spec.center.x, y: brick.spec.center.y },
                        width: brick.spec.width,
                        height: brick.spec.height,
                        color: brick.spec.fillColor,
                    });

                    particle.createParticles();
                    particles.push(particle);
                    toRemove.push(brick);
                }
            }
        }

        if (toRemove.length > 0){
            for (let row = 0; row < bricks.length; row++) {
                let rowList = bricks[row];
                for (let i = 0; i < toRemove.length; i++) {
                    let index = rowList.indexOf(toRemove[i]);
                    if (index >= 0) {
                        rowList.splice(index, 1);
                    }
                }
            }
        }

        let rowsRemaining = 0;
        for (let i = 0; i < bricks.length; i++) {
            if ( bricks[i].length > 0) {
                rowsRemaining += 1;
            }
        }

        if (rowsRemaining < rowCount) {
            score += 25;
            rowCount = bricks.length;
            rowCount -= 1;
        }

        // TODO: try to fix
        // if ( score >= nextBall) {
        //     let ball = new MyGame.ball('red');
        //     balls.push(ball);
        //     nextBall += 100;
        // }
    }

    function renderBricks() {
        for (let row = 0; row < bricks.length; row++) {
            let rowList = bricks[row];
            for (let column = 0; column < rowList.length; column++) {
                let brick = rowList[column];
                MyGame.graphics.drawRectangle(brick.spec);
            }
        }
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

    function renderLives() {
        for (let i = 0; i < lives - 1; i++) {
            MyGame.graphics.drawRectangle({
                center: { x: 60, y: 740 - 15 * i },
                fillColor: 'red',
                outlineColor: 'white',
                width: 50,
                height: 10,
              });
        }

        MyGame.graphics.drawText({
            font: 'small-caps 24px arial',
            fillStyle: 'white', 
            strokeStyle: 'white',
            position: {x: 100, y: 720},
            text: "lives"
        });
    }

    function renderScore() {
        MyGame.graphics.drawText({
            font: 'small-caps 24px arial',
            fillStyle: 'white', 
            strokeStyle: 'white',
            position: {x: 610, y: 720},
            text: "Score"
        });

        MyGame.graphics.drawText({
            font: 'small-caps 24px arial',
            fillStyle: 'white', 
            strokeStyle: 'white',
            position: {x: 710, y: 720},
            text: score
        });
    }

    function renderCountdown() {
        let num = 3;
        if (countDownLeft > 2000) { num = 3; }
        else if (countDownLeft > 1000) { num = 2; }
        else if (countDownLeft > 0) { num = 1; }

        MyGame.graphics.drawText({
            font: 'small-caps 128px arial',
            fillStyle: 'white', 
            strokeStyle: 'black',
            position: {x: 750 / 2 - 32, y: 750 / 2},
            text: num
        });
    }

    function updateTopScores() {
        MyGame.storage.update(score);
        scoresUpdated = true;
    }

    function renderEnding() {
        MyGame.graphics.drawText({
            font: 'small-caps 128px arial',
            fillStyle: 'white', 
            strokeStyle: 'black',
            position: {x: 64, y: 750 / 2 - 128},
            text: `Game Over`
        });

        MyGame.graphics.drawText({
            font: 'small-caps 128px arial',
            fillStyle: 'white', 
            strokeStyle: 'black',
            position: {x: 144, y: 750 / 2},
            text: `score: ${score}`
        });
    }

    function resetState () {
        myKeyboard = input.Keyboard();
        particles = [];
        bricks = [];
        paddle = null;
        balls = [];
        scoresUpdated = false;
        countDown = true;
        firstTop = true;
        paused = true;
        countDownLeft = 3000;
        nextBall = 100;
        rowCount = 8;
        score = 0;
        lives = 3;
        initialize();
    }

}(MyGame.game, MyGame.input));
