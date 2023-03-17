'use strict';

let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');

function clear() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function drawTriangle(spec) {
    context.save();

    context.translate(spec.center.x, spec.center.y);
    context.rotate(spec.rotation);
    context.translate(-spec.center.x, -spec.center.y);

    context.beginPath();

    context.moveTo(spec.points[0].x, spec.points[0].y);
    context.lineTo(spec.points[1].x, spec.points[1].y);
    context.lineTo(spec.points[2].x, spec.points[2].y);

    context.closePath();

    context.strokeStyle = spec.outlineColor;
    context.fillStyle = spec.fillColor;

    context.fill();
    context.stroke();

    context.restore();
}

function drawRectangle(spec) {
    context.save();

    context.translate(spec.center.x, spec.center.y);
    context.rotate(spec.rotation);
    context.translate(-spec.center.x, -spec.center.y);

    context.strokeStyle = spec.outlineColor;
    context.fillStyle = spec.fillColor;

    context.fillRect(
        spec.left.x, spec.left.y, 
        spec.right.x - spec.left.x, spec.right.y - spec.left.y);

    context.strokeRect(
        spec.left.x, spec.left.y, 
        spec.right.x - spec.left.x, spec.right.y - spec.left.y);

    context.restore();
}
