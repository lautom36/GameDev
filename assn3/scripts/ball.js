MyGame.ball = (function (color) {
  let that = {
      spec: {
        center: { x: 750 / 2, y: 695 }, 
        fillColor: color,
        outlineColor: 'black',
        radius: 10,
        direction: {x: .3, y: -1},
        speed: 2,
        maxSpeed: 10,
        dead: false,
        ballsBroken: 0,
      },
  };

  checkCollisions = function(paddle, bricks) {
    collideWithWall();
    collideWithBrick(bricks);
    collideWithPaddle(paddle);
  }

  collideWithWall = function() {
    // hits top wall
    if ( that.spec.center.y - that.spec.radius < 0 ) {
      that.spec.direction.y = -that.spec.direction.y;
    }

    // hits bottom 
    if ( that.spec.center.y + that.spec.radius > 750 ) {
      that.spec.dead = true;
    }

    // hits either side
    if ( that.spec.center.x - that.spec.radius < 0 || that.spec.center.x > 750 - that.spec.radius) {
      that.spec.direction.x = -that.spec.direction.x;
    }
  }

  collideWithBrick = function(bricks) {
    let hit = false;
    for(let row = 0; row < bricks.length; row++) {
      let rowList = bricks[row];
      for(let column = 0; column < rowList.length; column++) {
        let brick = rowList[column];

        //TODO: tweak the velocity values
        if (checkForCollide(brick, that)) {

          let bottomSide  = brick.spec.center.y - (brick.spec.height / 2);
          let topSide     = brick.spec.center.y + (brick.spec.height / 2);
          let hitSide     = bottomSide <= that.spec.center.y && topSide >= that.spec.center.y;
          
          let leftBottom  = brick.spec.center.x - (brick.spec.width / 2);
          let rightBottom = brick.spec.center.x + (brick.spec.width / 2);
          let hitBot      = leftBottom <= that.spec.center.x && rightBottom >= that.spec.center.x;
          
          // if it hits the top or bottom change the y direction
          if (hitBot) {
            that.spec.direction.y = -that.spec.direction.y;
          }
          // if it hits the side change x direction
          else if (hitSide) {
            that.spec.direction.x = -that.spec.direction.x;
          }


          hit = true;
          let centerOfBrickX = brick.spec.center.x;
          let ballDistFromBrickCenterX = that.spec.center.x - centerOfBrickX;
          let vel = ballDistFromBrickCenterX / 50;
          that.spec.ballsBroken += 1;

          if (that.spec.ballsBroken ===  4) { that.spec.speed += .5; }
          if (that.spec.ballsBroken === 12) { that.spec.speed += .5; }
          if (that.spec.ballsBroken === 36) { that.spec.speed += .5; }
          if (that.spec.ballsBroken === 62) { that.spec.speed +=  1; }

          // if (hitBot) { that.spec.direction.y += vel; }
          // if (hitSide) { that.spec.direction.x += vel; }
          that.spec.direction.x += vel   
          brick.spec.hit = true;
        }
        if (hit) { break; }
      }
      if (hit) { break; }
    }
  }

  collideWithPaddle = function(paddle) {
    if ( checkForCollide(paddle, that) ) {
      // flip y direction
      that.spec.direction.y *= -1;

      let centerOfPaddleX = paddle.spec.center.x;
      let ballDistFromPaddleCenterX = that.spec.center.x - centerOfPaddleX;
      let vel = ballDistFromPaddleCenterX / 100;

      that.spec.direction.x += vel
    } 
  }

  checkForCollide = function(a, ball) {
    let aLeftOfBall  = ( a.spec.center.x + a.spec.width  / 2) < ( ball.spec.center.x - ball.spec.radius);
    let aRightOfBall = ( a.spec.center.x - a.spec.width  / 2) > ( ball.spec.center.x + ball.spec.radius);
    let aAboveBall   = ( a.spec.center.y - a.spec.height / 2) > ( ball.spec.center.y + ball.spec.radius);
    let aBelowBall   = ( a.spec.center.y + a.spec.height / 2) < ( ball.spec.center.y - ball.spec.radius);

    return !( aLeftOfBall || aRightOfBall || aAboveBall || aBelowBall );
  }

  that.update = function(paddle, bricks) {
    that.spec.center.x += that.spec.direction.x * that.spec.speed;
    that.spec.center.y += that.spec.direction.y * that.spec.speed;
    
    checkCollisions(paddle, bricks);
    if (that.spec.dead) {

      return true;
    }
    return false;
  }

  return that;
});
