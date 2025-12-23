# 🐍 Snake Game - Complete Explanation

## 📋 Table of Contents
1. [Game Overview](#game-overview)
2. [How Canvas Works](#how-canvas-works)
3. [How the Snake Moves](#how-the-snake-moves)
4. [How the Snake Gets Bigger](#how-the-snake-gets-bigger)
5. [Score Storage System](#score-storage-system)
6. [Main Functions Explained](#main-functions-explained)

---

## 🎮 Game Overview

This is a classic **Snake Game** built with HTML5 Canvas and JavaScript. The player controls a snake that:
- Moves continuously in one direction
- Grows longer when eating food
- Dies if it hits the wall or itself
- Has three difficulty levels (Easy, Medium, Hard)

### Files Structure:
- **index.html** - The game structure (HTML)
- **style.css** - Visual styling and colors
- **index.js** - Game logic and functionality

---

## 🎨 How Canvas Works

### What is Canvas?
Canvas is like a **digital drawing board** in HTML where we can draw shapes, images, and animations using JavaScript.

### In Our Game:

```html
<canvas id="gameBoard" width="500" height="500"></canvas>
```

**Key Points:**
- Canvas size: **500x500 pixels**
- We divide it into a **grid** using `unitSize = 25`
- This creates a **20x20 grid** (500 ÷ 25 = 20)

### How We Draw on Canvas:

```javascript
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");  // Get drawing tool
```

**Drawing Examples:**
1. **Drawing the background** (checkerboard pattern):
```javascript
function ColorBoard() {
  const darkTile = "#0f1419";
  const lightTile = "#1a1f2e";
  
  for (let i = 0; i < gameWidth / unitSize; i++) {
    for (let j = 0; j < gameHeight / unitSize; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? darkTile : lightTile;
      ctx.fillRect(i * unitSize, j * unitSize, unitSize, unitSize);
    }
  }
}
```
- Uses nested loops to create a checkerboard
- Alternates between dark and light tiles

2. **Drawing the snake**:
```javascript
function drawSnake() {
  ctx.fillStyle = snakeColor;      // Cyan color
  ctx.strokeStyle = snakeBorder;   // Border color
  
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
```

3. **Drawing the food**:
```javascript
function drawFood() {
  ctx.fillStyle = foodColor;  // Red-pink color
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
```

---

## 🐍 How the Snake Moves

### Snake Data Structure
The snake is an **array of objects**, where each object represents a body segment:

```javascript
let snake = [
  { x: 100, y: 0 },  // Head
  { x: 75, y: 0 },   // Body segment
  { x: 50, y: 0 },   // Body segment
  { x: 25, y: 0 },   // Body segment
  { x: 0, y: 0 }     // Tail
];
```

### Movement System

**1. Velocity Variables:**
```javascript
let xVelocity = unitSize;  // Moving right (25 pixels)
let yVelocity = 0;         // Not moving vertically
```

**2. Direction Control:**
```javascript
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  
  // Example: Pressing LEFT arrow
  case keyPressed == LEFT && !goingRight:
    xVelocity = -unitSize;  // Move left
    yVelocity = 0;          // Stop vertical movement
    break;
}
```

**3. Moving the Snake:**
```javascript
function moveSnake() {
  // Create new head position
  const head = { 
    x: snake[0].x + xVelocity,  // Add velocity to current position
    y: snake[0].y + yVelocity 
  };
  
  snake.unshift(head);  // Add new head to front
  snake.pop();          // Remove tail (if no food eaten)
}
```

**Visual Example:**
```
Before move:  [HEAD] → [BODY] → [BODY] → [TAIL]
After move:   [NEW HEAD] → [OLD HEAD] → [BODY] → [BODY]
              (tail removed)
```

### Game Loop (Animation)
```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();      // 1. Clear and redraw board
      drawFood();        // 2. Draw food
      moveSnake();       // 3. Calculate new position
      drawSnake();       // 4. Draw snake at new position
      checkGameOver();   // 5. Check collisions
      nextTick();        // 6. Repeat!
    }, gameSpeed);       // Speed: 50-120ms
  }
}
```

---

## 📈 How the Snake Gets Bigger

### Food Creation
```javascript
function createFood() {
  function randomFood(min, max) {
    const randNum = 
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
```
- Creates random position aligned to grid
- Ensures food appears within game boundaries

### Eating Food Logic
```javascript
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);  // Always add new head
  
  // Check if snake ate food
  if (head.x === foodX && head.y === foodY) {
    score += 1;              // Increase score
    scoreText.textContent = score;
    createFood();            // Create new food
    // DON'T remove tail - snake grows!
  } else {
    snake.pop();  // Remove tail - snake stays same size
  }
}
```

**Key Concept:**
- **Normal move**: Add head → Remove tail (same length)
- **Eating food**: Add head → Keep tail (grows by 1)

**Visual Example:**
```
Before eating:
[HEAD] → [BODY] → [TAIL]  🍎

After eating:
[NEW HEAD] → [OLD HEAD] → [BODY] → [TAIL]
(tail NOT removed - snake is now longer!)
```

---

## 🎮 Difficulty Levels System

### Three Speed Levels
The game has **three difficulty levels** that control how fast the snake moves:

| Level | Speed (ms) | Description |
|-------|-----------|-------------|
| **Easy** | 120ms | Slower, good for beginners |
| **Medium** | 90ms | Default speed, balanced gameplay |
| **Hard** | 50ms | Fast-paced, challenging |

### How It Works

**1. HTML Buttons:**
```html
<button class="levelBtn" data-speed="120">Easy (Slow)</button>
<button class="levelBtn active" data-speed="90">Medium</button>
<button class="levelBtn" data-speed="50">Hard (Fast)</button>
```
- Each button has a `data-speed` attribute
- The `active` class shows which level is selected
- Medium is the default (has `active` class)

**2. JavaScript Implementation:**
```javascript
let gameSpeed = 90;  // Default: Medium

const levelButtons = document.querySelectorAll(".levelBtn");
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Get speed from button's data-speed attribute
    gameSpeed = parseInt(btn.getAttribute("data-speed"));
    
    // Remove active class from all buttons
    levelButtons.forEach((b) => b.classList.remove("active"));
    
    // Add active class to clicked button
    btn.classList.add("active");
    
    // Game continues smoothly - no reset needed!
  });
});
```

**3. How Speed Affects the Game:**
The `gameSpeed` variable controls the delay in the game loop:

```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, gameSpeed);  // ← This controls the speed!
  }
}
```

**Understanding the Speed:**
- **Lower number = Faster game** (50ms = very fast)
- **Higher number = Slower game** (120ms = slower)
- The number is the delay between each frame

**Example:**
- Easy (120ms): Snake moves ~8 times per second
- Medium (90ms): Snake moves ~11 times per second
- Hard (50ms): Snake moves ~20 times per second

### Smooth Level Switching
**Important Feature:** You can change difficulty **during gameplay** without resetting!
- The game doesn't restart when you switch levels
- Your score is preserved
- The snake continues from its current position
- Only the speed changes instantly

This makes it easy to:
- Start on Easy to learn the game
- Switch to Medium when comfortable
- Challenge yourself with Hard mode

---

## 💾 Score Storage System

### Using localStorage
**localStorage** saves data in the browser permanently (even after closing the page).

### Implementation

**1. Loading Best Score (on page load):**
```javascript
let bestScore = parseInt(localStorage.getItem("snakeBestScore")) || 0;
bestScoreText.textContent = bestScore;
```
- `localStorage.getItem("snakeBestScore")` - Gets saved score
- `|| 0` - If no saved score, use 0

**2. Updating Best Score:**
```javascript
if (score > bestScore) {
  bestScore = score;
  bestScoreText.textContent = bestScore;
  localStorage.setItem("snakeBestScore", bestScore);  // Save to browser
}
```

**3. Current Score:**
```javascript
let score = 0;  // Resets every game

// When eating food:
score += 1;
scoreText.textContent = score;
```

**Difference:**
- **Current Score**: Temporary, resets when game restarts
- **Best Score**: Permanent, saved in browser, only updates if beaten

---

## 🔧 Main Functions Explained

### 1. `gameStart()`
**Purpose:** Initialize and start the game
```javascript
function gameStart() {
  running = true;           // Enable game loop
  scoreText.textContent = score;
  createFood();             // Place first food
  drawFood();               // Draw it
  nextTick();               // Start game loop
}
```

### 2. `nextTick()`
**Purpose:** Main game loop (runs continuously)
```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();      // Redraw background
      drawFood();        // Redraw food
      moveSnake();       // Update snake position
      drawSnake();       // Draw snake
      checkGameOver();   // Check if game ended
      nextTick();        // Call itself again
    }, gameSpeed);       // Wait based on difficulty
  } else {
    displayGameOver();   // Show game over screen
  }
}
```

### 3. `checkGameOver()`
**Purpose:** Detect collisions
```javascript
function checkGameOver() {
  const head = snake[0];
  
  // Wall collision
  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= gameWidth;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= gameHeight;
  
  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    running = false;
    return;
  }
  
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      running = false;
      return;
    }
  }
}
```

### 4. `resetGame()`
**Purpose:** Restart the game
```javascript
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
    { x: 0, y: 0 }
  ];
  gameStart();
}
```

### 5. Difficulty Levels
```javascript
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    gameSpeed = parseInt(btn.getAttribute("data-speed"));
    // Easy: 120ms (slower)
    // Medium: 90ms
    // Hard: 50ms (faster)
  });
});
```

---

## 🎯 Summary for Presentation

### Key Technologies:
1. **HTML5 Canvas** - Drawing board for graphics
2. **JavaScript** - Game logic and interactivity
3. **CSS** - Styling and visual effects
4. **localStorage** - Saving best score

### How It Works:
1. **Canvas** creates a 20x20 grid
2. **Snake** is an array that grows/shrinks
3. **Movement** uses velocity and position updates
4. **Game loop** redraws everything 10-20 times per second
5. **Collision detection** checks walls and self-collision
6. **Score** is saved permanently in browser

### Cool Features:
- ✨ Neon glow effects
- 🎨 Checkerboard pattern background
- 🏆 Best score persistence
- 🎮 Three difficulty levels
- 🔄 Smooth animations

---

## 📝 Presentation Tips

1. **Start with a demo** - Show the game running
2. **Explain Canvas** - Show how we draw shapes
3. **Demonstrate movement** - Explain the array concept
4. **Show growth mechanism** - Explain the tail removal logic
5. **Display localStorage** - Open browser DevTools → Application → Local Storage
6. **Show code snippets** - Focus on key functions

Good luck with your presentation! 🚀
# 🐍 Snake Game - Complete Explanation

## 📋 Table of Contents
1. [Game Overview](#game-overview)
2. [How Canvas Works](#how-canvas-works)
3. [How the Snake Moves](#how-the-snake-moves)
4. [How the Snake Gets Bigger](#how-the-snake-gets-bigger)
5. [Score Storage System](#score-storage-system)
6. [Main Functions Explained](#main-functions-explained)

---

## 🎮 Game Overview

This is a classic **Snake Game** built with HTML5 Canvas and JavaScript. The player controls a snake that:
- Moves continuously in one direction
- Grows longer when eating food
- Dies if it hits the wall or itself
- Has three difficulty levels (Easy, Medium, Hard)

### Files Structure:
- **index.html** - The game structure (HTML)
- **style.css** - Visual styling and colors
- **index.js** - Game logic and functionality

---

## 🎨 How Canvas Works

### What is Canvas?
Canvas is like a **digital drawing board** in HTML where we can draw shapes, images, and animations using JavaScript.

### In Our Game:

```html
<canvas id="gameBoard" width="500" height="500"></canvas>
```

**Key Points:**
- Canvas size: **500x500 pixels**
- We divide it into a **grid** using `unitSize = 25`
- This creates a **20x20 grid** (500 ÷ 25 = 20)

### How We Draw on Canvas:

```javascript
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");  // Get drawing tool
```

**Drawing Examples:**
1. **Drawing the background** (checkerboard pattern):
```javascript
function ColorBoard() {
  const darkTile = "#0f1419";
  const lightTile = "#1a1f2e";
  
  for (let i = 0; i < gameWidth / unitSize; i++) {
    for (let j = 0; j < gameHeight / unitSize; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? darkTile : lightTile;
      ctx.fillRect(i * unitSize, j * unitSize, unitSize, unitSize);
    }
  }
}
```
- Uses nested loops to create a checkerboard
- Alternates between dark and light tiles

2. **Drawing the snake**:
```javascript
function drawSnake() {
  ctx.fillStyle = snakeColor;      // Cyan color
  ctx.strokeStyle = snakeBorder;   // Border color
  
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
```

3. **Drawing the food**:
```javascript
function drawFood() {
  ctx.fillStyle = foodColor;  // Red-pink color
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
```

---

## 🐍 How the Snake Moves

### Snake Data Structure
The snake is an **array of objects**, where each object represents a body segment:

```javascript
let snake = [
  { x: 100, y: 0 },  // Head
  { x: 75, y: 0 },   // Body segment
  { x: 50, y: 0 },   // Body segment
  { x: 25, y: 0 },   // Body segment
  { x: 0, y: 0 }     // Tail
];
```

### Movement System

**1. Velocity Variables:**
```javascript
let xVelocity = unitSize;  // Moving right (25 pixels)
let yVelocity = 0;         // Not moving vertically
```

**2. Direction Control:**
```javascript
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  
  // Example: Pressing LEFT arrow
  case keyPressed == LEFT && !goingRight:
    xVelocity = -unitSize;  // Move left
    yVelocity = 0;          // Stop vertical movement
    break;
}
```

**3. Moving the Snake:**
```javascript
function moveSnake() {
  // Create new head position
  const head = { 
    x: snake[0].x + xVelocity,  // Add velocity to current position
    y: snake[0].y + yVelocity 
  };
  
  snake.unshift(head);  // Add new head to front
  snake.pop();          // Remove tail (if no food eaten)
}
```

**Visual Example:**
```
Before move:  [HEAD] → [BODY] → [BODY] → [TAIL]
After move:   [NEW HEAD] → [OLD HEAD] → [BODY] → [BODY]
              (tail removed)
```

### Game Loop (Animation)
```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();      // 1. Clear and redraw board
      drawFood();        // 2. Draw food
      moveSnake();       // 3. Calculate new position
      drawSnake();       // 4. Draw snake at new position
      checkGameOver();   // 5. Check collisions
      nextTick();        // 6. Repeat!
    }, gameSpeed);       // Speed: 50-120ms
  }
}
```

---

## 📈 How the Snake Gets Bigger

### Food Creation
```javascript
function createFood() {
  function randomFood(min, max) {
    const randNum = 
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
```
- Creates random position aligned to grid
- Ensures food appears within game boundaries

### Eating Food Logic
```javascript
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);  // Always add new head
  
  // Check if snake ate food
  if (head.x === foodX && head.y === foodY) {
    score += 1;              // Increase score
    scoreText.textContent = score;
    createFood();            // Create new food
    // DON'T remove tail - snake grows!
  } else {
    snake.pop();  // Remove tail - snake stays same size
  }
}
```

**Key Concept:**
- **Normal move**: Add head → Remove tail (same length)
- **Eating food**: Add head → Keep tail (grows by 1)

**Visual Example:**
```
Before eating:
[HEAD] → [BODY] → [TAIL]  🍎

After eating:
[NEW HEAD] → [OLD HEAD] → [BODY] → [TAIL]
(tail NOT removed - snake is now longer!)
```

---

## 🎮 Difficulty Levels System

### Three Speed Levels
The game has **three difficulty levels** that control how fast the snake moves:

| Level | Speed (ms) | Description |
|-------|-----------|-------------|
| **Easy** | 120ms | Slower, good for beginners |
| **Medium** | 90ms | Default speed, balanced gameplay |
| **Hard** | 50ms | Fast-paced, challenging |

### How It Works

**1. HTML Buttons:**
```html
<button class="levelBtn" data-speed="120">Easy (Slow)</button>
<button class="levelBtn active" data-speed="90">Medium</button>
<button class="levelBtn" data-speed="50">Hard (Fast)</button>
```
- Each button has a `data-speed` attribute
- The `active` class shows which level is selected
- Medium is the default (has `active` class)

**2. JavaScript Implementation:**
```javascript
let gameSpeed = 90;  // Default: Medium

const levelButtons = document.querySelectorAll(".levelBtn");
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Get speed from button's data-speed attribute
    gameSpeed = parseInt(btn.getAttribute("data-speed"));
    
    // Remove active class from all buttons
    levelButtons.forEach((b) => b.classList.remove("active"));
    
    // Add active class to clicked button
    btn.classList.add("active");
    
    // Game continues smoothly - no reset needed!
  });
});
```

**3. How Speed Affects the Game:**
The `gameSpeed` variable controls the delay in the game loop:

```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, gameSpeed);  // ← This controls the speed!
  }
}
```

**Understanding the Speed:**
- **Lower number = Faster game** (50ms = very fast)
- **Higher number = Slower game** (120ms = slower)
- The number is the delay between each frame

**Example:**
- Easy (120ms): Snake moves ~8 times per second
- Medium (90ms): Snake moves ~11 times per second
- Hard (50ms): Snake moves ~20 times per second

### Smooth Level Switching
**Important Feature:** You can change difficulty **during gameplay** without resetting!
- The game doesn't restart when you switch levels
- Your score is preserved
- The snake continues from its current position
- Only the speed changes instantly

This makes it easy to:
- Start on Easy to learn the game
- Switch to Medium when comfortable
- Challenge yourself with Hard mode

---

## 💾 Score Storage System

### Using localStorage
**localStorage** saves data in the browser permanently (even after closing the page).

### Implementation

**1. Loading Best Score (on page load):**
```javascript
let bestScore = parseInt(localStorage.getItem("snakeBestScore")) || 0;
bestScoreText.textContent = bestScore;
```
- `localStorage.getItem("snakeBestScore")` - Gets saved score
- `|| 0` - If no saved score, use 0

**2. Updating Best Score:**
```javascript
if (score > bestScore) {
  bestScore = score;
  bestScoreText.textContent = bestScore;
  localStorage.setItem("snakeBestScore", bestScore);  // Save to browser
}
```

**3. Current Score:**
```javascript
let score = 0;  // Resets every game

// When eating food:
score += 1;
scoreText.textContent = score;
```

**Difference:**
- **Current Score**: Temporary, resets when game restarts
- **Best Score**: Permanent, saved in browser, only updates if beaten

---

## 🔧 Main Functions Explained

### 1. `gameStart()`
**Purpose:** Initialize and start the game
```javascript
function gameStart() {
  running = true;           // Enable game loop
  scoreText.textContent = score;
  createFood();             // Place first food
  drawFood();               // Draw it
  nextTick();               // Start game loop
}
```

### 2. `nextTick()`
**Purpose:** Main game loop (runs continuously)
```javascript
function nextTick() {
  if (running) {
    setTimeout(() => {
      ColorBoard();      // Redraw background
      drawFood();        // Redraw food
      moveSnake();       // Update snake position
      drawSnake();       // Draw snake
      checkGameOver();   // Check if game ended
      nextTick();        // Call itself again
    }, gameSpeed);       // Wait based on difficulty
  } else {
    displayGameOver();   // Show game over screen
  }
}
```

### 3. `checkGameOver()`
**Purpose:** Detect collisions
```javascript
function checkGameOver() {
  const head = snake[0];
  
  // Wall collision
  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= gameWidth;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= gameHeight;
  
  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    running = false;
    return;
  }
  
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      running = false;
      return;
    }
  }
}
```

### 4. `resetGame()`
**Purpose:** Restart the game
```javascript
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
    { x: 0, y: 0 }
  ];
  gameStart();
}
```

### 5. Difficulty Levels
```javascript
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    gameSpeed = parseInt(btn.getAttribute("data-speed"));
    // Easy: 120ms (slower)
    // Medium: 90ms
    // Hard: 50ms (faster)
  });
});
```

---

## 🎯 Summary for Presentation

### Key Technologies:
1. **HTML5 Canvas** - Drawing board for graphics
2. **JavaScript** - Game logic and interactivity
3. **CSS** - Styling and visual effects
4. **localStorage** - Saving best score

### How It Works:
1. **Canvas** creates a 20x20 grid
2. **Snake** is an array that grows/shrinks
3. **Movement** uses velocity and position updates
4. **Game loop** redraws everything 10-20 times per second
5. **Collision detection** checks walls and self-collision
6. **Score** is saved permanently in browser

### Cool Features:
- ✨ Neon glow effects
- 🎨 Checkerboard pattern background
- 🏆 Best score persistence
- 🎮 Three difficulty levels
- 🔄 Smooth animations

---

## 📝 Presentation Tips

1. **Start with a demo** - Show the game running
2. **Explain Canvas** - Show how we draw shapes
3. **Demonstrate movement** - Explain the array concept
4. **Show growth mechanism** - Explain the tail removal logic
5. **Display localStorage** - Open browser DevTools → Application → Local Storage
6. **Show code snippets** - Focus on key functions

Good luck with your presentation! 🚀
