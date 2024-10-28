"use strict";

// DEFINING HTML ELEMENTS BY STORING THEM IN VARIABLES
const board = document.querySelector(".game_board");
const instructions = document.querySelector("#instruction_text");
const logo = document.querySelector(".bloodworm-logo");

// DEFINING GAME VARIABLES
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

// TESTING DRAWBLOODWORM FUNCTION
// draw();

// DRAW PREY FUNCTION
function drawPrey() {
  const preyElem = createGameElem("div", "prey");
  setPos(preyElem, prey);
  board.appendChild(preyElem);
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
  // bloodWorm.pop();

  if (bloodWormHead.x === prey.x && bloodWormHead.y === prey.y) {
    prey = generatePrey();
    // CLEARS PREVIOUS INTERVALS
    clearInterval();
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    bloodWorm.pop();
  }
}

// STARTS GAME
function startGame() {
  gameStart = true;
  // instructions.style.display = "none";
  // logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    // collisionCheck();
    draw();
  }, gameSpeedDelay);
}

// SPACEBAR KEY WILL INITIATE GAME USING ADDEVENTLISTENER
