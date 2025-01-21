const gameContainer = document.getElementById('game-container');
const dino = document.getElementById('dino');
const gameOverMessage = document.getElementById('game-over-message');
let isJumping = false;
const fallSpeed = 6;
let gameRunning = true; 

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping && gameRunning) {
    jump();
  }
});

function jump() {
  let position = 10; 
  isJumping = true;
  const upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (position <= 10) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= fallSpeed;
        dino.style.bottom = `${position}px`;
      }, 20);
    } else {
      position += fallSpeed;
      dino.style.bottom = `${position}px`;
    }
  }, 20);
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
    if (obstaclePosition < -20) {
      clearInterval(moveInterval);
      gameContainer.removeChild(obstacle);
    } else {
      if (checkCollision(obstacle, dino)) {
        endGame();
        clearInterval(moveInterval);
      }
    }
    obstaclePosition -= 5;
    obstacle.style.left = `${obstaclePosition}px`;
  }, 20);
  setTimeout(createObstacle, Math.random() * 2000 + 1000);
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