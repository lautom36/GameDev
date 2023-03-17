MyGame.screens['game-play'] = (function(game, input) {
    'use strict';

    // TODO: [15 points] check reflection
    // TODO: [8  points] add count down
    // TODO: [8  points] store highscores
    // TODO: [8  points] be able to reset highscores
    // TODO: [5  points] add shrink animation
    // TODO: [5  points] add ball speed increase as you break bricks
    // TODO: [5  points] popup menue for pausing and continuing
    // TODO: [5  points] add missing ball and using lives
    // TODO: [5  points] add another ball at 100 points
    // TODO: [3  points] add music

    let todo = [
        'TODO: add music', 
        'TODO: add count down', 
        'TODO: add missing ball and using lives', 
        'TODO: add shrink animation',
        'TODO: add ball speed increase as you break bricks',
        'TODO: check reflection',
        'TODO: add another ball at 100 points',
        'TODO: popup menue for pausing and continuing',
        'TODO: store highscores',
        'TODO: be able to reset highscores',
        'TODO: add music'
    ];
    for (let i = 0; i < todo.length; i++){ console.log(todo[i]); }

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let particles = [];
    let bricks = [];
    let paddle = null;
    let ball = null;
    let countDown = false;
    let firstTop = true;
    let paused = false;
    let rowCount = 0;
    let score = 0;
    let lives = 3;


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        // console.log(ball)
        if (!paused) {
            ball.update(paddle, bricks);
            checkBricks();
            updateParticles(elapsedTime);
        }
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
        // render ball
        MyGame.graphics.drawCircle(ball.spec);
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
        ball = MyGame.ball()

        // render text and start frame

        

        // register inputs
        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            // game.showScreen('main-menu');
            paused = !paused;
            cancelNextRequest = false;
        });

        myKeyboard.register('a', paddle.moveLeft);

        myKeyboard.register('d', paddle.moveRight);
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
                    // if (row = 7 && column == 0) {
                    //     console.log(toRemove);
                    // }
                }

            }
        }

        if (toRemove.length > 0){
            // console.log(toRemove);
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

        if (bricks.length < rowCount) {
            score += 100;
            rowCount = bricks.length;
        }
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
                fillColor: 'black',
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

}(MyGame.game, MyGame.input));
