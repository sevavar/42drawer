let cols = 60;
let rows = 60;
let pixelSize = 40;
let subpixelWidth = pixelSize / 8;
let subdivisionLevels;
let hoverStates;
let pixelColors;
let maxSubdivision = 4;
let delay = 20;
let lastUpdateTime;
let margin = 5;
const colors = ['#404347', '#FF2020', '#0d0', '#2D2DFF'];
const bgColor = '#222222';

function setup() {
  frameRate(30);
  createCanvas(cols * pixelSize, rows * pixelSize);
  noStroke();
  subdivisionLevels = Array(rows).fill().map(() => Array(cols).fill(0));
  hoverStates = Array(rows).fill().map(() => Array(cols).fill(false));
  pixelColors = Array(rows).fill().map(() => Array(cols).fill(null));
  lastUpdateTime = millis();
}

function draw() {
  background(bgColor);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let pixelX = x * pixelSize;
      let pixelY = y * pixelSize;
      
      hoverStates[y][x] = mouseX > pixelX && mouseX < pixelX + pixelSize &&
                          mouseY > pixelY && mouseY < pixelY + pixelSize;
      
      if (hoverStates[y][x] && millis() - lastUpdateTime > delay) {
        if (subdivisionLevels[y][x] < maxSubdivision) {
          subdivisionLevels[y][x]++;
          lastUpdateTime = millis();
          if (pixelColors[y][x] === null) {
            pixelColors[y][x] = getRandomColor();
          }
        }
      }
      
      if (hoverStates[y][x] || subdivisionLevels[y][x] > 0) {
        drawPixelState(pixelX, pixelY, subdivisionLevels[y][x], pixelColors[y][x]);
      }
    }
  }
}

function getRandomColor() {
  let rand = random();
  if (rand < 0.7) {
    return colors[0];
  } else {
    let otherColors = colors.slice(1);
    return random(otherColors);
  }
}

function drawPixelState(x, y, level, color) {
  if (level == 0) {
    fill(bgColor);
    rect(x, y, pixelSize, pixelSize);
  } else if (level == 1) {
    fill(color);
    rect(x + margin, y + margin, pixelSize - 2 * margin, pixelSize - 2 * margin);
    fill(bgColor);
    rect(x + (pixelSize / 12) * 5, y, (pixelSize / 12) * 2, pixelSize);
  } else if (level == 4) {
    fill(bgColor);
    rect(x, y, pixelSize, pixelSize);
    fill(color);
    ellipse(x + pixelSize * 0.25, y + pixelSize * 0.25, pixelSize / 2 - margin, pixelSize / 2 - margin);
    ellipse(x + pixelSize * 0.75, y + pixelSize * 0.75, pixelSize / 2 - margin, pixelSize / 2 - margin);
    ellipse(x + pixelSize * 0.25, y + pixelSize * 0.75, pixelSize / 2 - margin, pixelSize / 2 - margin);
    ellipse(x + pixelSize * 0.75, y + pixelSize * 0.25, pixelSize / 2 - margin, pixelSize / 2 - margin);
  } else if (level == 2) {
    fill(color);
    rect(x, y, pixelSize, pixelSize);
  } else if (level == 3) {
    fill(bgColor);
    rect(x, y, pixelSize, pixelSize);
    fill(color);
    ellipse(x + pixelSize * 0.5, y + pixelSize * 0.5, pixelSize - margin, pixelSize - margin);
  }
}

function exportToSVG() {
  let svgCanvas = createGraphics(width, height, SVG);
  svgCanvas.background(bgColor);
  svgCanvas.noStroke();
  
  // Redraw everything on the SVG canvas
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let pixelX = x * pixelSize;
      let pixelY = y * pixelSize;
      
      if (subdivisionLevels[y][x] > 0) {
        // Custom drawPixelState function for SVG
        drawSVGPixelState(svgCanvas, pixelX, pixelY, subdivisionLevels[y][x], pixelColors[y][x]);
      }
    }
  }
  
  svgCanvas.save('fortytwo.svg');
  svgCanvas.remove();
}

function drawSVGPixelState(svg, x, y, level, color) {
  if (level == 0) {
    svg.fill(bgColor);
    svg.rect(x, y, pixelSize, pixelSize);
  } else if (level == 1) {
    svg.fill(color);
    svg.rect(x + margin, y + margin, pixelSize - 2 * margin, pixelSize - 2 * margin);
    svg.fill(bgColor);
    svg.rect(x + (pixelSize / 12) * 5, y, (pixelSize / 12) * 2, pixelSize);
  } else if (level == 4) {
    svg.fill(bgColor);
    svg.rect(x, y, pixelSize, pixelSize);
    svg.fill(color);
    svg.ellipse(x + pixelSize * 0.25, y + pixelSize * 0.25, pixelSize / 2 - margin, pixelSize / 2 - margin);
    svg.ellipse(x + pixelSize * 0.75, y + pixelSize * 0.75, pixelSize / 2 - margin, pixelSize / 2 - margin);
    svg.ellipse(x + pixelSize * 0.25, y + pixelSize * 0.75, pixelSize / 2 - margin, pixelSize / 2 - margin);
    svg.ellipse(x + pixelSize * 0.75, y + pixelSize * 0.25, pixelSize / 2 - margin, pixelSize / 2 - margin);
  } else if (level == 2) {
    svg.fill(color);
    svg.rect(x, y, pixelSize, pixelSize);
  } else if (level == 3) {
    svg.fill(bgColor);
    svg.rect(x, y, pixelSize, pixelSize);
    svg.fill(color);
    svg.ellipse(x + pixelSize * 0.5, y + pixelSize * 0.5, pixelSize - margin, pixelSize - margin);
  }
}

function mousePressed() {
    exportToSVG();
}
