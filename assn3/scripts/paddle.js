MyGame.paddle = (function () {
  let that = {
      spec: {
        center: { x: 750 / 2, y: 710 },
        fillColor: 'black',
        outlineColor: 'white',
        width: 100,
        height: 10,
        score: 0,
        moveRate: 500
      },
  };


  that.moveRight = function (elapsedTime) {
    that.spec.center.x += that.spec.moveRate * (elapsedTime / 750)
    // need to check if thats out of the canvas
    if (that.spec.center.x + that.spec.width / 2 >= 750) {
      that.spec.center.x = 750 - that.spec.width / 2;
    }
  }

  that.moveLeft = function (elapsedTime) {
    that.spec.center.x -= that.spec.moveRate * (elapsedTime / 750)
    // need to check if thats out of the canvas
    if (that.spec.center.x - that.spec.width / 2 <= 0) {
      that.spec.center.x = that.spec.width / 2;
    }

  }

  return that;
});
