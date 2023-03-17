MyGame.ball = (function () {
  let that = {
      spec: {
        center: { x: 750 / 2, y: 750 * .75 }, 
        fillColor: 'white',
        outlineColor: 'black',
        radius: 10,
        xVelocity: 0,
        yVelocity: 1,
        dead: false,
      },
  };

  checkCollisions = function(paddle, bricks) {
    collideWithWall();
    collideWithBrick(bricks);
    collideWithPaddle(paddle);
  }

  collideWithWall = function() {
    // hits top wall
    if ( that.spec.center.y < 0 ) {
      that.spec.yVelocity = -that.spec.yVelocity;
    }
    // hits bottom TODO: this needs to change
    if ( that.spec.center.y > 750 ) {
      that.spec.yVelocity = -that.spec.yVelocity;
    }

    // hits either side
    if ( that.spec.center.x < 0 || that.spec.center.x > 750 - that.spec.radius) {
      that.spec.xVelocity = -that.spec.xVelocity;
    }
  }

  collideWithBrick = function(bricks) {
    for(let row = 0; row < bricks.length; row++) {
      let rowList = bricks[row];
      for(let column = 0; column < rowList.length; column++) {
        let brick = rowList[column];
        //TODO: tweak the velocity values
        if (checkForCollide(brick, that)) {
          that.spec.yVelocity *= -1;
          let centerOfBrickX = brick.spec.center.x;
          let ballDistFromBrickCenterX = that.spec.center.x - centerOfBrickX;
          that.spec.xVelocity = ballDistFromBrickCenterX * 0.05;
          brick.spec.hit = true;
        }
      }
    }
  }

  collideWithPaddle = function(paddle) {
    if ( checkForCollide(paddle, that) ) {
      that.spec.yVelocity *= -1;
      let centerOfPaddleX = paddle.spec.center.x;
      let ballDistFromPaddleCenterX = that.spec.center.x - centerOfPaddleX;
      that.spec.xVelocity = ballDistFromPaddleCenterX * 0.05;
    } 
  }

  checkForCollide = function(a, ball) {
    let aLeftOfBall = ( a.spec.center.x + a.spec.width / 2 ) < ( ball.spec.center.x - ball.spec.radius);
    let aRightOfBall = ( a.spec.center.x - a.spec.width / 2) > ( ball.spec.center.x + ball.spec.radius);
    let aAboveBall = ( a.spec.center.y ) > ( ball.spec.center.y + ball.spec.radius);
    let aBelowBall = ( a.spec.center.y + a.spec.height ) < ( ball.spec.center.y );

    return !( aLeftOfBall || aRightOfBall || aAboveBall || aBelowBall );
  }

  that.update = function(paddle, bricks) {
    that.spec.center.x += that.spec.xVelocity;
    that.spec.center.y += that.spec.yVelocity;
    checkCollisions(paddle, bricks);
  }

  return that;
});
