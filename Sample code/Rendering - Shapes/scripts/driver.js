'use strict';

let rect1 = {
    left: { x: 100, y: 100},
    right: { x: 300, y: 300 },
    center: { x: 200, y: 200 },
    outlineColor: 'rgb(255, 0, 0)',
    fillColor: 'rgb(0, 0, 255)',
    rotation: 0
};

let tri1 = {
    center: { x: 200, y:200 },
    points: [
        { x: 200, y: 100},
        { x: 300, y: 300},
        { x: 100, y: 300}
    ],
    outlineColor: 'rgb(255, 0, 0)',
    fillColor: 'rgb(0, 255, 0)',
    rotation: 0
};

function update() {
    rect1.rotation += 0.01;
    tri1.rotation -= 0.01;
}

function render() {
    clear();
    drawRectangle(rect1);
    drawTriangle(tri1);
}

function gameLoop(time) {
    update();
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
