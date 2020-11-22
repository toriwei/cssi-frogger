// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, colorMode, createCanvas, collideRectCircle, ellipse, fill, height, keyCode, random, rect,
 *    strokeWeight, text, textSize, width
 *    UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW
      loadSound loadImage triangle collidePointTriangle
 */

let backgroundColor,
  frogX,
  frogY,
  score,
  lives,
  gameLost,
  gameWon,
  cars,
  song,
  jumpSound,
  backgroundImage,
  powerUps,
  lifeAdded;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frogX = 250;
  frogY = 450
  score = 0;
  lives = 3;
  gameLost = false;
  gameWon = false;
  lifeAdded = false;

  cars = [
    { x: 0, y: 100, v: 5, color: [272, 80, 100], startLeft: true }, // object
    { x: 400, y: 200, v: 3, color: [345, 80, 100], startLeft: false },
    { x: 0, y: 300, v: 4, color: [237, 80, 100], startLeft: true },
    { x: 400, y: 350, v: 6, color: [180, 80, 100], startLeft: false }
  ];

  powerUps = [
    { x1: 0, y1: 275, x2: 20, y2: 250, x3: 40, y3: 275, v: 2, color: [58, 80, 100], startLeft: true}
  ];
  song = loadSound(
    "https://cdn.glitch.com/f0aa194d-a11a-4d30-bd55-305f52d5f403%2FFrog%20Croaking-SoundBible.com-1053984354.mp3?v=1594756050520"
  );
  jumpSound = loadSound(
    "https://cdn.glitch.com/f0aa194d-a11a-4d30-bd55-305f52d5f403%2FJump-SoundBible.com-1007297584.mp3?v=1594756456041"
  );
  backgroundImage = loadImage(
    "https://cdn.glitch.com/f0aa194d-a11a-4d30-bd55-305f52d5f403%2Fswamp2.jpg?v=1594764665295"
  );
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    background(255, 0, 0);
  } else {
    song.play();
    background(0, 255, 0);
  }
}
function draw() {
  background(backgroundImage);
  drawGoal();
  drawFrog();
  moveCars();
  drawCars();

  movePowerUps();
  drawPowerUps();

  checkCollisions();
  checkWin();
  displayScores();
}
function drawGoal() {
  fill(58, 80, 100);
  rect(0, 0, width, 80);
}
function drawFrog() {
  fill(120, 80, 100);
  ellipse(frogX, frogY, 20);
}

function keyPressed() {
  if (!gameWon && !gameLost) {
    // can only move frog when playing game (not after winning or losing)
    if (keyCode === UP_ARROW) {
      frogY -= 30;
      jumpSound.play();
    } else if (keyCode === DOWN_ARROW) {
      frogY += 30;
      jumpSound.play();
    } else if (keyCode === LEFT_ARROW) {
      frogX -= 30;
      jumpSound.play();
    } else if (keyCode === RIGHT_ARROW) {
      frogX += 30;
      jumpSound.play();
    }
  }
}

function moveCars() {
  if (!gameWon && !gameLost) {
    // cars only move when actually playing game
    for (let car of cars) {
      if (car.startLeft == true) {
        // cars moving left to right
        car.x += car.v;
        if (car.x > width) {
          // Reset if it moves off screen
          car.x = -40;
        }
      }
      if (car.startLeft == false) {
        // cars moving right to left
        car.x -= car.v;
        if (car.x < -40) {
          // reset if car moves off screen
          car.x = width + 40;
        }
      }
    }
  }
}

function movePowerUps() {
  if (!gameWon && !gameLost) {
    for (let powerUp of powerUps) {
      if (powerUp.startLeft == true) {
        powerUp.x1 += powerUp.v;
        powerUp.x2 += powerUp.v;
        powerUp.x3 += powerUp.v;
        if (powerUp.x1 > width &&  lifeAdded == false) {
          powerUp.x1 = -40;
          powerUp.x2 = -20;
          powerUp.x3 = 0;
        }
      }
      if (powerUp.startLeft == false) {
        powerUp.x1 -= powerUp.v;
        powerUp.x2 -= powerUp.v;
        powerUp.x3 -= powerUp.v;
        if (powerUp.x1 < -40) {
          powerUp.x1 = width;
          powerUp.x2 = width + 20;
          powerUp.x3 = width + 40;
        }
      }
    }
  }
}

function drawCars() {
  for (let car of cars) {
    fill(car.color);
    rect(car.x, car.y, 40, 30);
  }
}
function drawPowerUps() {
  for (let powerUp of powerUps) {
    fill(powerUp.color);
    triangle(
      powerUp.x1,
      powerUp.y1,
      powerUp.x2,
      powerUp.y2,
      powerUp.x3,
      powerUp.y3
    );
  }
}
function checkCollisions() {
  // If the frog collides with the car, reset the frog and subtract a life.
  for (let car of cars) {
    if (collideRectCircle(car.x, car.y, 40, 30, frogX, frogY, 20)) {
      frogX = 250;
      frogY = 450;
      lives--;
      lifeAdded = false;
    }
  }
  for (let powerUp of powerUps) {
    if (
      lifeAdded == false && collidePointTriangle(
        frogX,
        frogY,
        powerUp.x1,
        powerUp.y1,
        powerUp.x2,
        powerUp.y2,
        powerUp.x3,
        powerUp.y3
      )
    ) {
      lives++;
      lifeAdded = true;
    }
  }
  if (lives <= 0) {
    gameLost = true;
  }
}

function checkWin() {
  // If the frog makes it into the yellow gold zone, increment the score
  // and move the frog back down to the bottom.
  if (frogY < 50) {
    score++;
    frogY = 450;
  }
  if (score >= 5) {
    gameWon = true;
  }
}

function displayScores() {
  textSize(12);
  fill('black');
  text(`Lives: ${lives}`, 10, 20);
  // Display Score
  text(`Score: ${score}`, 10, 30);
  fill('white')
  if (gameLost) {
    textSize(60);
    text("GAME OVER", width / 2 - 200, height / 2);
  }
  if (gameWon) {
    textSize(60);
    text("YOU WON", width / 2 - 145, height / 2);
  }
}
