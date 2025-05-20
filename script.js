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

// Suporte para cantos arredondados
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

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

  // Comida (maçã)
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Cobra
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#4CAF50' : '#81C784'; // Cabeça e corpo
    ctx.strokeStyle = '#558B2F';
    ctx.lineWidth = 2;
    ctx.roundRect(snake[i].x, snake[i].y, box, box, 6);
    ctx.fill();
    ctx.stroke();
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  // Colisões
  if (headX < 0 || headX >= canvasSize || headY < 0 || headY >= canvasSize) {
    gameOver();
    return;
  }

  for (let i = 0; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Comer
  if (headX === food.x && headY === food.y) {
    score++;
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }
    food = generateFood();

    // Aumentar velocidade
    clearInterval(gameInterval);
    speed = Math.max(50, speed - 5);
    gameInterval = setInterval(draw, speed);
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);
}

function gameOver() {
  clearInterval(gameInterval);
  alert('Fim de jogo! Sua pontuação: ' + score);
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;
  scoreElement.textContent = score;
  speed = 150;
  gameInterval = setInterval(draw, speed);
}

gameInterval = setInterval(draw, speed);
