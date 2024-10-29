"use strict";

// DEFINING HTML ELEMENTS BY STORING THEM IN VARIABLES
const board = document.querySelector(".game_board");
const instructions = document.querySelector("#instruction_text");
const BWlogo = document.querySelector(".bloodworm-logo");

// DEFINING GAME VARIABLES
const scoreEle = document.querySelector("#score");
const highScoreEle = document.querySelector("#highScore");
let highScore = 0;
let gridArea = 20;
let bloodWorm = [{ x: 10, y: 10 }];
let prey = generatePrey();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStart = false;

// DRAWS GAME MAP, BLOODWORM, AND PREY
function draw() {
  board.innerHTML = "";
  drawBloodWorm();
  drawPrey();
  scoreUpate();
}

// DRAW BLOODWORM
function drawBloodWorm() {
  bloodWorm.forEach((segPos) => {
    const wormElement = createGameElem("div", "bloodWorm");
    setPos(wormElement, segPos);
    board.appendChild(wormElement);
  });
}

// CREATES NEW BLOOWORM POSITION AND ALSO PREY ON GRID
function createGameElem(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// SET POSITION OF BLOODWORM OR RANDOMIZED PREY LOCATION ON GRID
function setPos(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// DRAW PREY FUNCTION
function drawPrey() {
  if (gameStart) {
    const preyElem = createGameElem("div", "prey");
    setPos(preyElem, prey);
    board.appendChild(preyElem);
  }
}

// GENERATES PREY AT RANDOM LOCATION THROUGHOUT GRID AREA
function generatePrey() {
  const x = Math.floor(Math.random() * gridArea) + 1;
  const y = Math.floor(Math.random() * gridArea) + 1;
  return { x, y };
}

// MOVING BLOODWORM ALL OVER GRID AREA
function move() {
  // SPREAD OPERATOR CREATES SHALLOW COPY OF BLOODWORM VARIABALE
  const bloodWormHead = { ...bloodWorm[0] };

  if (direction === "up") {
    bloodWormHead.y--;
  } else if (direction === "right") {
    bloodWormHead.x++;
  } else if (direction === "down") {
    bloodWormHead.y++;
  } else if (direction === "left") {
    bloodWormHead.x--;
  }

  bloodWorm.unshift(bloodWormHead);

  if (bloodWormHead.x === prey.x && bloodWormHead.y === prey.y) {
    prey = generatePrey();
    increaseSpeed();
    // CLEARS PREVIOUS INTERVALS
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      collisionDetect();
      draw();
    }, gameSpeedDelay);
  } else {
    bloodWorm.pop();
  }
}

// STARTS GAME
function startGame() {
  gameStart = true;
  instructions.style.display = "none";
  BWlogo.style.display = "none";
  board.style.backgroundImage = "url('BWBG.png')";
  board.style.backgroundPosition = "center";
  board.style.backgroundSize = "contain";
  gameInterval = setInterval(() => {
    move();
    collisionDetect();
    draw();
  }, gameSpeedDelay);
}

// SPACEBAR KEY WILL INITIATE GAME USING ADDEVENTLISTENER
function initSession(e) {
  if ((!gameStart && e.code === "space") || (!gameStart && e.key === " ")) {
    startGame();
  } else {
    if (e.key === "ArrowUp") {
      direction = "up";
    } else if (e.key === "ArrowRight") {
      direction = "right";
    } else if (e.key === "ArrowDown") {
      direction = "down";
    } else if (e.key === "ArrowLeft") {
      direction = "left";
    }
  }
}

document.addEventListener("keydown", initSession);
function increaseSpeed() {
  // CONDITIONALS MANAGE THE SPEED OF BLOODWORM THE MORE IT EATS SO IT  DOESN'T GET OUT OF CONTROL AND BECOME HARD TO MOVE
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// CHECKS TO SEE IF THERE IS A COLLISION AND RESETS GAME IF BLOODWORM COLLIDES WITH SURROUNDINGS
function collisionDetect() {
  const bloodWormHead = bloodWorm[0];

  if (
    bloodWormHead.x < 1 ||
    bloodWormHead.x > gridArea ||
    bloodWormHead.y < 1 ||
    bloodWormHead.y > gridArea
  ) {
    resetGame();
    board.style.backgroundImage = "none";
    board.style.backgroundPosition = "none";
    board.style.backgroundSize = "none";
  }

  for (let s = 1; s < bloodWorm.length; s++) {
    if (
      bloodWormHead.x === bloodWorm[s].x &&
      bloodWormHead.y === bloodWorm[s].y
    ) {
      resetGame();
      board.style.backgroundImage = "none";
      board.style.backgroundPosition = "none";
      board.style.backgroundSize = "none";
    }
  }
}

// RESETS GAME FUNCTION CALL
function resetGame() {
  hightScoreUpdate();
  stopGame();
  bloodWorm = [{ x: 10, y: 10 }];
  prey = generatePrey();
  direction = "right";
  gameSpeedDelay = 200;
  scoreUpate();
}

// UPDATES SCORE UPON GAME RESET
function scoreUpate() {
  const currentScore = bloodWorm.length - 1;
  score.innerHTML = currentScore.toString().padStart(3, "0");
}

// STOPS GAME, SELF EXPLANATORY :D
function stopGame() {
  clearInterval(gameInterval);
  gameStart = false;
  instructions.style.display = "block";
  BWlogo.style.display = "block";
}

// UPDATES HIGH SCORE
function hightScoreUpdate() {
  const currentScore = bloodWorm.length - 1;

  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreEle.innerHTML = highScore.toString().padStart(3, "0");
  }
  highScoreEle.style.display = "block";
}
