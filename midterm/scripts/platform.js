MyGame.platform = (function (spec) {
  let that = {
      spec: {
        center: { x: spec.center.x, y: 10 },
        fillColor: 'red',
        // outlineColor: 'red',
        width: 750,
        height: 15,
        gapSize: 100,
        speed: .25,
      },
  };

  that.update = function (elapsedTime) {
      that.spec.center.y += that.spec.speed * elapsedTime;
  }

  return that;
});
