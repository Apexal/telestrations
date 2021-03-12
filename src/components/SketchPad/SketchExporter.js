/*
    gif.js does not play nice with React, so the includes are included in the public/index.html file.
*/

//import GIF from "../../gif";

// function drawStroke(ctx, stroke, offset) {
//     ctx.beginPath();
//     ctx.moveTo(stroke.from.x - offset.x, stroke.from.y - offset.y);
//     ctx.lineTo(stroke.to.x - offset.x, stroke.to.y - offset.y);
//     ctx.lineWidth = stroke.options.width;
//     ctx.strokeStyle = stroke.options.color;
//     ctx.lineCap = "round";
//     ctx.stroke();
//     ctx.closePath();
// }

// function exportAsGif(strokes) {
//     // console.log(process.env.PUBLIC_URL)
//     // const gif = new GIF({
//     //     workers: 3,
//     //     quality: 10,
//     //     height: 400,
//     //     width: 400,
//     //     workerScript: process.env.PUBLIC_URL + '/gif.worker.js'
//     // });
    
//     // const canvas = document.createElement("canvas");
//     // canvas.width = 400;
//     // canvas.height = 400;

//     // const context = canvas.getContext("2d");
//     // context.fillStyle = "white";
//     // context.fillRect(0, 0, canvas.width, canvas.height);
    
//     // const offset = { x: canvas.offsetLeft, y: canvas.offsetTop };

//     // for (let i = 0; i < strokes.length; i++) {
//     //     drawStroke(context, strokes[i], offset);
        
//     //     if (i % 10 == 0)
//     //         gif.addFrame(context, {copy: true, delay: 1});
//     // }
    
//     // gif.addFrame(context, {copy: true, delay: 1});
    
//  //   gif.on('finished', function(blob) {
//    //     window.open(URL.createObjectURL(blob));
//    // });
      
//    // gif.render();

   
// }

// export default exportAsGif;
