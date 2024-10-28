"use strict";

// DEFINING HTML ELEMENTS BY STORING THEM IN VARIABLES
const board = document.querySelector(".game_board");

// DEFINING GAME VARIABLES
let bloodWorm = [{ x: 10, y: 10 }];

// DRAWS GAME MAP, BLOODWORK, AND PREY
function draw() {
  board.innerHTML = "";
  drawBloodWorm();
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

// SET POSITION OF BLOODWORM OR RANDOMIZED PREY ON GRID
function setPos(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// TESTING DRAWBLOODWORM FUNCTION
drawBloodWorm();
