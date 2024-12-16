"use strict";

// I USED OOP STRUCTURE FOR THE GAME, BECAUSE ITS A BIT CLEANER THAN THE STANDARD FUNCTION OR CONSTRUCTOR FUNCTION-PROTOYPE APPROACH
class BloodWormGame {
  constructor() {
    // DEFINING HTML ELEMENTS (LOGO & INSTRUCTIONS) ON GAME SCREEN
    this.screen = document.querySelector(".game_screen");
    this.instructions = document.querySelector("#instruction_text");
    this.BWlogo = document.querySelector(".bloodworm-logo");

    // DEFINING GAME ELEMENTS
    this.scoreEle = document.querySelector("#score");
    this.highScoreEle = document.querySelector("#highScore");
    this.highScore = 0;
    this.gridCells = 20;
    this.bloodWorm = [{ x: 10, y: 10 }];
    this.prey = this.generatePrey();
    this.direction = "right";
    this.gameInterval = null;
    this.gameSpeedDelay = 200;
    this.gameStart = false;
    this.bgMusic = new Audio("/sounds/8-bit-moonlight-sonata.mp3");
    this.eatFX = new Audio("/sounds/eatingsound.mp3");

    // LOOPS MUSIC AND CONTROLS VOLUME
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    // SAVES HIGHSCORE TO LOCAL STORAGE UPON REFRESH OF BROWSER
    this.highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
    this.highScoreEle.innerHTML = this.highScore.toString().padStart(3, "0");

    // ADDEVENTLISTENER FUNCTION ON SPACEBAR KEYDOWN
    document.addEventListener("keydown", (e) => this.initSession(e));
  }

  // DRAWS ELEMENTS TO THE GRID ("GAME screen")
  draw() {
    this.screen.innerHTML = "";
    this.drawBloodWorm();
    this.drawPrey();
    this.updateScore();
  }

  // DRAWS BLOODWORM
  drawBloodWorm() {
    this.bloodWorm.forEach((segPos) => {
      const wormElement = this.createGameElem("div", "bloodWorm");
      this.setPos(wormElement, segPos);
      this.screen.appendChild(wormElement);
    });
  }

  // Create Game Element (Bloodworm/Prey)
  createGameElem(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  // Set Position of Element on Grid
  setPos(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
  }

  // Draw Prey on Grid
  drawPrey() {
    if (this.gameStart) {
      const preyElem = this.createGameElem("div", "prey");
      this.setPos(preyElem, this.prey);
      this.screen.appendChild(preyElem);
    }
  }

  // Generate Prey at Random Location
  generatePrey() {
    const x = Math.floor(Math.random() * this.gridCells) + 1;
    const y = Math.floor(Math.random() * this.gridCells) + 1;
    return { x, y };
  }

  // Move Bloodworm across Grid
  move() {
    const bloodWormHead = { ...this.bloodWorm[0] };

    if (this.direction === "up") bloodWormHead.y--;
    else if (this.direction === "right") bloodWormHead.x++;
    else if (this.direction === "down") bloodWormHead.y++;
    else if (this.direction === "left") bloodWormHead.x--;

    this.bloodWorm.unshift(bloodWormHead);

    if (bloodWormHead.x === this.prey.x && bloodWormHead.y === this.prey.y) {
      // WHEN BLOODWORM COORDS MEET PREYS, SOUNDS FX PLAY
      this.eatFX.play();
      this.eatFX.currentTime = 0; // Restart sound

      this.prey = this.generatePrey();
      this.increaseSpeed();
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => {
        this.move();
        this.collisionDetect();
        this.draw();
      }, this.gameSpeedDelay);
    } else {
      this.bloodWorm.pop();
    }
  }

  // Start Game
  startGame() {
    this.gameStart = true;
    this.instructions.style.display = "none";
    this.BWlogo.style.display = "none";
    this.screen.style.backgroundImage = "url('/images/BWBG.png')";
    this.screen.style.backgroundPosition = "center";
    this.screen.style.backgroundSize = "contain";

    // STARTS MUSIC
    this.bgMusic.play();

    this.gameInterval = setInterval(() => {
      this.move();
      this.collisionDetect();
      this.draw();
    }, this.gameSpeedDelay);
  }

  // Initialize Game Session on Key Press
  initSession(e) {
    if (
      (!this.gameStart && e.code === "space") ||
      (!this.gameStart && e.key === " ")
    ) {
      this.startGame();
    } else {
      if (e.key === "ArrowUp") this.direction = "up";
      else if (e.key === "ArrowRight") this.direction = "right";
      else if (e.key === "ArrowDown") this.direction = "down";
      else if (e.key === "ArrowLeft") this.direction = "left";
    }
  }

  // Increase Game Speed
  increaseSpeed() {
    if (this.gameSpeedDelay > 150) this.gameSpeedDelay -= 5;
    else if (this.gameSpeedDelay > 100) this.gameSpeedDelay -= 3;
    else if (this.gameSpeedDelay > 50) this.gameSpeedDelay -= 2;
    else if (this.gameSpeedDelay > 25) this.gameSpeedDelay -= 1;
  }

  // Detect Collisions with Grid Boundaries or Self
  collisionDetect() {
    const bloodWormHead = this.bloodWorm[0];

    if (
      bloodWormHead.x < 1 ||
      bloodWormHead.x > this.gridCells ||
      bloodWormHead.y < 1 ||
      bloodWormHead.y > this.gridCells
    ) {
      this.resetGame();
      this.resetScreenStyle();
    }

    for (let s = 1; s < this.bloodWorm.length; s++) {
      if (
        bloodWormHead.x === this.bloodWorm[s].x &&
        bloodWormHead.y === this.bloodWorm[s].y
      ) {
        this.resetGame();
        this.resetScreenStyle();
      }
    }
  }

  // RESETS screen
  resetScreenStyle() {
    this.screen.style.backgroundImage = "none";
    this.screen.style.backgroundPosition = "none";
    this.screen.style.backgroundSize = "none";
  }

  // RESETS BLOODWORM GAME
  resetGame() {
    this.updateHighScore();
    this.stopGame();
    this.bloodWorm = [{ x: 10, y: 10 }];
    this.prey = this.generatePrey();
    this.direction = "right";
    this.gameSpeedDelay = 200;
    this.updateScore();
  }

  // UPDATES CURRENT SCORE BASED ON BLOODWORM LENGTH
  updateScore() {
    const currentScore = this.bloodWorm.length - 1;
    this.scoreEle.innerHTML = currentScore.toString().padStart(3, "0");
  }

  // INACTIVE GAME
  stopGame() {
    clearInterval(this.gameInterval);
    this.gameStart = false;
    this.instructions.style.display = "block";
    this.BWlogo.style.display = "block";

    // STOPS MUSIC WHEN GAME RESETS
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  // UPDATE HIGHSCORE AND SETS TO LOCAL STORAGE API
  updateHighScore() {
    const currentScore = this.bloodWorm.length - 1;

    if (currentScore > this.highScore) {
      this.highScore = currentScore;
      localStorage.setItem("highScore", this.highScore);
      this.highScoreEle.innerHTML = this.highScore.toString().padStart(3, "0");
    }
    this.highScoreEle.style.display = "block";
  }
}

// INITIATES GAME
const play = new BloodWormGame();
