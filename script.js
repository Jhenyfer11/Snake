const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;
let speed = 150;
let gameInterval;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
  else if (key === 38 && direction !== 'DOWN') direction = 'UP';
  else if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
  else if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * canvasBoxes) * box,
    y: Math.floor(Math.random() * canvasBoxes) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  // Check collision with walls
  if (headX < 0 || headX >= canvasSize || headY < 0 || headY >= canvasSize) {
    gameOver();
    return;
  }

  // Check collision with self
  for (let i = 0; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Check if food is eaten
  if (headX === food.x && headY === food.y) {
    score++;
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }
    food = generateFood();

    // Increase speed
    clearInterval(gameInterval);
    speed = Math.max(50, speed - 5);
    gameInterval = setInterval(draw, speed);
  } else {
    snake.pop();
  }

  // Add new head
  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);
}

function gameOver() {
  clearInterval(gameInterval);
  alert('Fim de jogo! Sua pontuação: ' + score);
  // Reset game
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;
  scoreElement.textContent = score;
  speed = 150;
  gameInterval = setInterval(draw, speed);
}

gameInterval = setInterval(draw, speed);
