const JUMP_MAX_HEIGHT = 150;
const START_POSITION = 10;
const FALL_SPEED = 6;
const MOVEMENT_INTERVAL = 20;
const OBSTACLE_SPEED = 5;
const MIN_OBSTACLE_RESPAWN = 1000;
const MAX_OBSTACLE_RESPAWN = 3000;
const OBSTACLE_REMOVE_POSITION = -20;

const gameContainer = document.getElementById('game-container');
const dino = document.getElementById('dino');
const gameOverMessage = document.getElementById('game-over-message');
let isJumping = false;
let gameRunning = true; 

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping && gameRunning) {
    jump();
  }
});

function jump() {
  let position = START_POSITION; 
  isJumping = true;
  const upInterval = setInterval(() => {
    if (position >= JUMP_MAX_HEIGHT) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (position <= START_POSITION) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= FALL_SPEED;
        dino.style.bottom = `${position}px`;
      }, MOVEMENT_INTERVAL);
    } else {
      position += FALL_SPEED;
      dino.style.bottom = `${position}px`;
    }
  }, MOVEMENT_INTERVAL);
}

function createObstacle() {
  if (!gameRunning) {
    return; 
  }
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  gameContainer.appendChild(obstacle);
  let obstaclePosition = gameContainer.offsetWidth;
  obstacle.style.left = `${obstaclePosition}px`;
  moveObstacle(obstacle, obstaclePosition);
}

function moveObstacle(obstacle, obstaclePosition) {
  const moveInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(moveInterval); 
      return;
    }
    if (obstaclePosition < - OBSTACLE_REMOVE_POSITION) {
      clearInterval(moveInterval);
      gameContainer.removeChild(obstacle);
    } else {
      if (checkCollision(obstacle, dino)) {
        endGame();
        clearInterval(moveInterval);
      }
    }
    obstaclePosition -= OBSTACLE_SPEED;
    obstacle.style.left = `${obstaclePosition}px`;
  }, MOVEMENT_INTERVAL);
  setTimeout(createObstacle, Math.random() * (MAX_OBSTACLE_RESPAWN - MIN_OBSTACLE_RESPAWN) + MIN_OBSTACLE_RESPAWN);
}

function checkCollision(obstacle, dino) {
  const dinoRect = dino.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  return (
    obstacleRect.right > dinoRect.left && 
    obstacleRect.left < dinoRect.right && 
    obstacleRect.bottom > dinoRect.top && 
    obstacleRect.top < dinoRect.bottom 
  );
}

function endGame() {
  gameRunning = false; 
  gameOverMessage.style.display = 'block'; 
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach((obstacle) => obstacle.remove());
  clearTimeout(createObstacle); 
}

createObstacle();