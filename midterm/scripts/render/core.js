MyGame.graphics = (function() {
    'use strict';

    let imgBackground = new Image();
    imgBackground.isReady = false;
    imgBackground.onload = function() {
        this.isReady = true;
    };
    imgBackground.src = 'assets/background.png';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        if (image.isReady) {
            context.save();
    
            context.translate(center.x, center.y);
            context.rotate(rotation);
            context.translate(-center.x, -center.y);
    
            context.drawImage(
                image,
                center.x - size.width / 2,
                center.y - size.height / 2,
                size.width, size.height);
    
            context.restore();
        }
    }

    function drawBackground() {

        if (imgBackground.isReady) {
    
            context.drawImage(
                imgBackground,
                0,
                0,
                750, 750);
    
        }
    }

    function drawPlatform(spec) {
        let center = spec.center;

        let leftBound = center.x - spec.gapSize / 2;
        let leftWidth = leftBound;
        let left = {
            center: {x: leftWidth / 2 , y: center.y}, 
            width: leftWidth,
            height: spec.height,
            fillColor: spec.fillColor,    
        }

        let rightBound = center.x + spec.gapSize / 2;
        let rightWidth = 750 - rightBound;
        let right = {
            center: {x: rightBound + rightWidth / 2 , y: center.y }, 
            width: rightWidth,
            height: spec.height,
            fillColor: spec.fillColor,    
        }
        // console.log(left)
        // console.log(right)
        // console.log('----')

        drawRectangle(left);
        drawRectangle(right);
        // console.log(bannana)
    }

    function drawRectangle(spec) {
        // console.log(spec)
        // context.save();

        // context.translate(spec.center.x, spec.center.y);
        // context.rotate(spec.rotation);
        // context.translate(-spec.center.x, -spec.center.y);

        context.strokeStyle = spec.outlineColor;
        context.fillStyle = spec.fillColor;

        context.fillRect(
            spec.center.x - (spec.width / 2), spec.center.y - (spec.height / 2), 
            spec.width, spec.height);

        // context.strokeRect(
        //     spec.center.x - (spec.width / 2), spec.center.y - (spec.height / 2), 
        //     spec.width - 2, spec.height - 2);

        // context.restore();
    }


    function drawText(spec) {
        context.save();
        
        
        context.font = spec.font;
        let width = context.measureText(spec.text);
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        // context.translate(spec.position.x - width.width / 2, spec.position.y);
        // context.rotate(spec.rotation);
        // context.translate(-(spec.position.x - width.width / 2), -spec.position.y);


        context.fillText(spec.text, spec.position.x - width.width / 2, spec.position.y);
        context.strokeText(spec.text, spec.position.x - width.width / 2, spec.position.y);

        context.restore();
    }

    function drawParticle(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.strokeStyle = 'white';
        context.fillStyle = spec.color;

        context.fillRect(
            spec.center.x - (spec.size / 2), spec.center.y - (spec.size / 2), 
            spec.size - 2, spec.size - 2);

        context.strokeRect(
            spec.center.x - (spec.width / 2), spec.center.y - (spec.height / 2), 
            spec.width - 2, spec.height - 2);

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawBackground: drawBackground,
        drawText: drawText,
        drawRectangle: drawRectangle,
        drawParticle: drawParticle,
        drawPlatform: drawPlatform,
    };

    return api;
}());
