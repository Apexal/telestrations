const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorButtons = document.getElementById("color-buttons");
const widthRange = document.getElementById("width-range");
const clearButton = document.getElementById("clear");
const undoButton = document.getElementById("undo");
const replayButton = document.getElementById("replay");
let currentPosition = { x: 0, y: 0 };
let replayTimeouts = [];

const UNDO_AMOUNT = 5; // # of strokes to remove on undo
const colors = ["black", "green", "red", "gold", "blue"];
const options = {
  width: parseInt(widthRange.value),
  color: "green",
};

let strokes = [];

// Create buttons for colors
for (const color of colors) {
  const colorButton = document.createElement("button");
  colorButton.textContent = color;
  colorButton.addEventListener("click", () => (options.color = color));
  colorButtons.appendChild(colorButton);
}

widthRange.addEventListener("change", function (e) {
  options.width = parseInt(e.target.value);
});

const offset = { x: canvas.offsetLeft, y: canvas.offsetTop };

function clear() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  replayTimeouts = [];
}

function resize() {
  offset.x = canvas.offsetLeft;
  offset.y = canvas.offsetTop;
}

function drawStroke(someCtx, stroke) {
  someCtx.beginPath();
  someCtx.moveTo(stroke.from.x - offset.x, stroke.from.y - offset.y);
  someCtx.lineTo(stroke.to.x - offset.x, stroke.to.y - offset.y);
  someCtx.lineWidth = stroke.options.width;
  someCtx.strokeStyle = stroke.options.color;
  someCtx.lineCap = "round";
  someCtx.stroke();
  someCtx.closePath();
}

function undo() {
  // Remove some strokes
  strokes.splice(-UNDO_AMOUNT);
  optimizeStrokes(strokes);
  clear();
  for (const stroke of strokes) {
    drawStroke(ctx, stroke);
  }
}

function setCurrentPosition({ clientX: x, clientY: y }) {
  currentPosition.x = x;
  currentPosition.y = y;
}

function replay() {
  clear();
  replayTimeouts = [];
  for (let i = 0; i < strokes.length; i++) {
    replayTimeouts.push(setTimeout(() => drawStroke(ctx, strokes[i]), 10 * i));
  }
}

function cancelReplay() {
  for (const timeout of replayTimeouts) {
    clearTimeout(timeout);
  }
  replayTimeouts = [];
  clear();
}

window.addEventListener("resize", resize);

canvas.addEventListener(
  "mousemove",
  function ({ buttons, clientX: x, clientY: y }) {
    if (buttons !== 1) return;
    const stroke = {
      from: { ...currentPosition },
      to: { x, y },
      options: { ...options },
    };
    strokes.push(stroke);
    optimizeStrokes(strokes);
    drawStroke(ctx, stroke);
    setCurrentPosition({ clientX: x, clientY: y });
    console.log(strokes.length);
  }
);

canvas.addEventListener("mouseenter", setCurrentPosition);

canvas.addEventListener("mousedown", setCurrentPosition);

canvas.addEventListener("mouseup", function() {
  clear();
  for (const stroke of strokes) {
    drawStroke(ctx, stroke);
  }
});

clearButton.addEventListener("click", () => {
  clear();
  strokes = [];
});

replayButton.addEventListener("click", function () {
  if (replayTimeouts.length) {
    cancelReplay();
  } else {
    replay();
  }
});

undoButton.addEventListener("click", undo);


function distance(posA, posB) {
  // { x, y }
  return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2));
}

function samePos(posA, posB) {
  return posA.x == posB.x && posA.y == posB.y;
}

function optimizeStrokes(anyStrokes) {
  for (let i = 2; i < anyStrokes.length; i++) {
    // prev stroke
    const stroke = anyStrokes[i];
    const prevStroke = anyStrokes[i-1];
    const prevPrevStroke = anyStrokes[i-2];

    if (distance(prevStroke.from, stroke.from) <= 5 && samePos(prevPrevStroke.to, prevStroke.from)) {
      console.log("OPTIMIZING");
      anyStrokes.splice(i-1, 1); // remove prevStroke
      prevPrevStroke.to = stroke.from;
    }
  }
}

function downloadGif() {
  const gif = new GIF({
    workers: 3,
    quality: 10,
    height: 400,
    width: 400,
    // transparent: '#fff'
  });

  const context=document.createElement("canvas").getContext("2d");
  context.canvas.height = 400;
  context.canvas.width = 400;

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < strokes.length; i++) {
    drawStroke(context, strokes[i]);
    if (i % 10 == 0)
      gif.addFrame(context, {copy: true, delay: 1});
  }
  gif.addFrame(context, {copy: true, delay: 1});

  gif.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));
  });
  
  gif.render();
}

document.getElementById("download").onclick = downloadGif;