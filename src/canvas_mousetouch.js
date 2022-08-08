// Source: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/

// canvas and context
var canvas, ctx;

// mouse positions X & Y, and mouse down indicator 
var mouseX, mouseY = 0;

// touch position X & Y
var touchX, touchY;

// Keep track of the old/last position when drawing a line
// Set it to -1 at the start to indicate not real value
var lastX, lastY = -1;

// Pixel size
var pixelSize = 14;

// holding pixel [28x28]
var pixels = [];

function clearPixel() {
  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

function fillPixel(currentX, currentY, scale) {
    x = Math.floor(currentY * scale);     //0.2
    y = Math.floor(currentX * scale) + 1;    // populate pixel array;
    // this will be used for MNIST inference
    //console.log("Pixel (x,y) = ", x, y);
    for (var dy = 0; dy < 2; dy++){
      for (var dx = 0; dx < 2; dx++){
          if ((x + dx < 28) && (y + dy < 28)){
              //console.log("pixel_index = ", ((y+dy)+(x+dx)*28));
              pixels[(y+dy)+(x+dx)*28] = 1;
          }
      }
  }
}

// canvas
canvas = document.getElementById("digitpad");

function initCanvas(){
  console.log("initCanvas()...");

  // If the browser supports the canvas tag, get the 2d drawing context for this canvas
  if (canvas.getContext)
    ctx = canvas.getContext('2d');  

  var imageData = ctx.getImageData(0, 0, 280, 280);
    
  if (ctx) {
    //var rect = canvas.getBoundingClientRect();
    //console.log("canvas rect (left, top, right, botoom): ", rect.left, rect.top, rect.right, rect.bottom);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, 280, 280);     // !!this is necessary otherwise the background will be black

    // React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener("mousedown", onmouseDown, false);
    canvas.addEventListener("mousemove", onmouseMove, false);
    canvas.addEventListener("mouseup", onmouseUp, false);

    // React to touch events on the canvas
    canvas.addEventListener('touchstart', ontouchStart, false);
    canvas.addEventListener('touchmove', ontouchMove, false);    
    canvas.addEventListener('touchend', ontouchEnd, false);    
  }
  //clearPixel();
}

function clearCanvas(){
  //console.log("clearing canvas...");
  //initCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearPixel();
}

// Keep track of the mouse button being pressed and draw a dot at current location
function onmouseDown() {
  mouseDown = 1;
  //drawLine(ctx, mouseX, mouseY, pixelSize);
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function onmouseMove(e) {
  // Update the mouse co-ordinates when moved
  getMousePos(e);

  if (e.buttons == 1) {
    // draw square dots on canvas
    //drawDot(ctx, mouseX, mouseY, pixelSize);
    // Draw line if the mouse button is currently being pressed
    drawLine(ctx, mouseX, mouseY, pixelSize);

    // populate pixel array;
    var scale = 0.1;
    fillPixel(mouseX, mouseY, scale);
  } 
}

// Keep track of the mouse button being released
function onmouseUp() {
  mouseDown = 0;
  // Reset lastX and lastY to -1 to indicate not pressed
  lastX = -1;
  lastY = -1;
}

function ontouchStart(e) {
  getTouchPos(e);
  //drawDot(ctx, touchX, touchY, pixelSize);
  drawLine(ctx, touchX, touchY, pixelSize);
  // Prevents an additional mousedown event being triggered
  event.preventDefault();  
}

function ontouchMove(e) {
  // Update the touch co-ordinates
  getTouchPos(e);
  // During a touchmove event, unlike a mousemove event,
  // don't need to check if the touch is engaged, since there will always
  // be contact with the screen by definition.
  //drawDot(ctx, touchX, touchY, pixelSize);
  drawLine(ctx, touchX, touchY, pixelSize);

  // populate pixel array;
  var scale = 0.09;
  fillPixel(touchX, touchY, scale);

  // Prevent a scrolling action as a result of this touchmove triggering.
  // there is a bug; won't work; but not needed
  event.preventDefault();
}

function ontouchEnd() {
  // Reset lastX and lastY to -1 to not touched
  lastX = -1;
  lastY = -1;
}

function getMousePos(e) {
  if (!e)
    var e = event;

  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
  //console.log(mouseX, mouseY);
}


/**
// Get the touch position relative to the top-left of the canvas
// The raw values of pageX and pageY below, take into account the scrolling
// on the page but not the position relative to the target div. 
// We'll adjust them using "target.offsetLeft" and "target.offsetTop" to get
// the correct values in relation to the top left of the canvas.
*/
function getTouchPos(e) {
  if (!e)
      var e = event;
  if (e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
          var touch = e.touches[0]; // Get the information for finger #1
          touchX=touch.pageX-touch.target.offsetLeft;
          touchY=touch.pageY-touch.target.offsetTop;
          //console.log("touch-pos: ", touchX, touchY);
      }
  }
}

// No longer used; keep for now!!
function drawDot(ctx, currentX, currentY, pixelSize) {
  //console.log("draw dot: ", currentX, currentY)
  // draw square dots on canvas
  ctx.fillStyle = "rgba(0, 0, 0)";
  //var pixelSize = 12;
  ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
}

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx, currentX, currentY, size) {
  //console.log("draw line: ", currentX, currentY);
  // If lastX is not set, set lastX and lastY to the current position 
  if (lastX == -1) {
      lastX = currentX;
      lastY = currentY;
  }
  // Canvas background is white;
  // Use black by setting RGB values to 0, and 255 alpha (completely opaque)
  r = 0; g = 0; b = 0; a = 255;
  // Select a fill style
  //ctx.fillStyle = "rgba(0, 0, 0)";
  //ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ")";
  // Set the line "cap" style to round, so lines at different angles can join into each other
  ctx.lineCap = "round";
  //ctx.lineJoin = "round";
  // Draw a filled line
  ctx.beginPath();
  // First, move to the old (previous) position
  ctx.moveTo(lastX, lastY);
  // Now draw a line to the current touch/pointer position
  ctx.lineTo(currentX, currentY);
  // Set the line thickness and draw the line
  ctx.lineWidth = size;
  ctx.stroke();
  ctx.closePath();
  // Update the last position to reference the current position
  lastX = currentX;
  lastY = currentY;
}


function download(){
  var download = document.getElementById("imageDownload");
  //var image = document.getElementById("digitpad").toDataURL("image/png")
  // digitpad or digitpad2
  var image = document.getElementById("digitpad").toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}