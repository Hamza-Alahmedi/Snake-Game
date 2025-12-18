
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const bestScoreText = document.querySelector("#bestScoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#1a1a2e";
const snakeColor = "#00ffff"; // Neon cyan
const snakeBorder = "#00d9ff"; // Bright cyan border
const foodColor = "#ff3366"; // Bright red-pink
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let bestScore = parseInt(localStorage.getItem("snakeBestScore")) || 0;
let gameSpeed = 90;

let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

// Load and display best score on page load
bestScoreText.textContent = bestScore;

const levelButtons = document.querySelectorAll(".levelBtn");
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    gameSpeed = parseInt(btn.getAttribute("data-speed"));
    levelButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    // Don't reset game when switching levels - just update speed smoothly
  });
});

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, gameSpeed);
  } else {
    displayGameOver();
  }
}

// giving color to the board
function ColorBoard() {
  // Draw checkerboard pattern with dark gaming colors
  const darkTile = "#0f1419";
  const lightTile = "#1a1f2e";

  for (let i = 0; i < gameWidth / unitSize; i++) {
    for (let j = 0; j < gameHeight / unitSize; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? darkTile : lightTile;
      ctx.fillRect(i * unitSize, j * unitSize, unitSize, unitSize);
    }
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

// change direction of the snake
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}



function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  // If snake eats the food, increase score and create new food
  if (head.x === foodX && head.y === foodY) {
    score += 1;
    scoreText.textContent = score;
    
    // Update best score if current score is higher
    if (score > bestScore) {
      bestScore = score;
      bestScoreText.textContent = bestScore;
      localStorage.setItem("snakeBestScore", bestScore);
    }
    
    createFood();
  } else {
    // remove the tail
    snake.pop();
  }
}

function checkGameOver() {
  const head = snake[0];

  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= gameWidth;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= gameHeight;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    running = false;
    return;
  }

  // Check self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      running = false;
      return;
    }
  }
}

function displayGameOver() {
  // Dark overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  
  // Game Over text with glow
  ctx.fillStyle = "#ff3366";
  ctx.font = "bold 50px Orbitron, Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff3366";
  ctx.shadowBlur = 20;
  ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2 - 20);
  
  // Instruction text
  ctx.fillStyle = "#00d9ff";
  ctx.font = "20px Orbitron, Arial";
  ctx.shadowColor = "#00d9ff";
  ctx.shadowBlur = 10;
  ctx.fillText("Press Reset to play again", gameWidth / 2, gameHeight / 2 + 30);
  
  ctx.shadowBlur = 0; // Reset shadow
  running = false;
}

function resetGame() {
  score = 0;
  scoreText.textContent = score;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
