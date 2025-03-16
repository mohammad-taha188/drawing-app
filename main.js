let canvas = document.querySelector("canvas");
let fontWidth = document.querySelector(".fontWidth");
let color = document.querySelector(".color");
let clear = document.querySelector(".clear");
let undoE = document.querySelector(".undo");
let download = document.querySelector(".download");
let brushes = document.querySelector(".brushes");

canvas.width = innerWidth;
canvas.height = innerHeight - 100;
let history = [];

window.addEventListener("resize", () => {
  saveData();
  canvas.width = innerWidth;
  canvas.height = innerHeight - 100;

  loadSave();
});

let ctx = canvas.getContext("2d");

let isDrawing = false;

function draw(e) {
  if (isDrawing) {
    let lastX;
    let lastY;
    if (brushes.value == 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else if (brushes.value == 2) {
      ctx.lineCap = "square";
      ctx.lineJoin = "bevel"; // گوشه‌های برش خورده
    }

    let x = e.offsetX;
    let y = e.offsetY;
    ctx.lineWidth = fontWidth.value;

    ctx.strokeStyle = color.value;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);

    ctx.stroke();
    lastX = x;
    lastY = y;
  }
}

canvas.addEventListener("mousedown", () => {
  ctx.beginPath();
  isDrawing = true;
});
canvas.addEventListener("mousemove", (e) => {
  draw(e);
});
window.addEventListener("mouseup", () => {
  isDrawing = false;
  saveImage();
});

let imageData;

function saveData() {
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function loadSave() {
  if (imageData) {
    ctx.putImageData(imageData, 0, 0);
  }
}
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
function saveImage() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  history.push(imageData);
}

function undo() {
  if (history.length > 0) {
    history.pop();
    let prevHistory = history[history.length - 1];
    if (prevHistory) {
      ctx.putImageData(prevHistory, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.code == "KeyZ") {
    undo();
  }
});

undoE.addEventListener("click", () => {
  undo();
});

download.addEventListener("click", () => {
  downloadCanvas();
});

function downloadCanvas() {
  let newCanvas = document.createElement("canvas");
  let ctxNew = newCanvas.getContext("2d");
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  ctxNew.fillStyle = "white";
  ctxNew.fillRect(0, 0, newCanvas.width, newCanvas.height);

  ctxNew.drawImage(canvas, 0, 0);

  let link = document.createElement("a");
  link.href = newCanvas.toDataURL("image/png");
  link.download = "drawing.png";
  link.click();
}
