MyGame.brick = (function (spec) {
  let that = {
      spec: {
        center: { x: spec.center.x, y: spec.center.y },
        fillColor: spec.fillColor,
        outlineColor: spec.outlineColor,
        width: spec.width,
        height: spec.height,
        value: spec.value,
        breakable: spec.breakable,
        hit: false,
      },
  };

  return that;
});
