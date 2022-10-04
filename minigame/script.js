// Get the canvas
const gameCanvas = document.getElementById("gameCanvas");
// Get the context
const gameContext = gameCanvas.getContext("2d");
// Set the canvas width and height
gameCanvas.width = 800;
gameCanvas.height = 600;

// Welcome Screen
gameContext.fillStyle = "#000000";
gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

gameContext.font = "30px Arial";
gameContext.fillStyle = "#FFFFFF";
gameContext.textAlign = "center";
gameContext.textBaseline = "middle";
gameContext.fillText("RoboSort", gameCanvas.width / 2, gameCanvas.height / 2);

var isGamePlaying = false;
var times = 0;
var gameSpeed = 1;
var score = 0;
var lives = 4;

// Wait until the user clicks the canvas to start the game
gameCanvas.addEventListener("click", function (event) {
    // Start the game
    if (!isGamePlaying) {
        requestAnimationFrame(fadeOut);
    } else {
        // Check if the user clicked on a controller
        motorCollector.isMouseOver(event.offsetX, event.offsetY);
        wheelCollector.isMouseOver(event.offsetX, event.offsetY);
    }
});

function fadeOut() {
    isGamePlaying = true;

    if (gameContext.globalAlpha > 0.01) {
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameContext.font = "30px Arial";
        gameContext.fillStyle = "#FFFFFF";
        gameContext.textAlign = "center";
        gameContext.textBaseline = "middle";
        gameContext.fillText("RoboSort", gameCanvas.width / 2, gameCanvas.height / 2);

        gameContext.globalAlpha -= 0.01;
        requestAnimationFrame(fadeOut);
    } else {
        gameContext.globalAlpha = 1;
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        setTimeout(() => {
            startGame();
        }, 300);
    }
}

function endGame() {
    if(isGamePlaying) {
        parts = [];
        gameContext.globalAlpha = 0;
        console.log("game ending")
    }

    isGamePlaying = false;

    console.log(gameContext.globalAlpha)
    if (gameContext.globalAlpha < 1) {
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameContext.font = "30px Arial";
        gameContext.fillStyle = "#FFFFFF";
        gameContext.textAlign = "center";
        gameContext.textBaseline = "middle";
        gameContext.fillText("Game Over", gameCanvas.width / 2, gameCanvas.height / 2);

        gameContext.globalAlpha += 0.01;
        if(gameContext.globalAlpha >= 0.99) gameContext.globalAlpha = 1
        requestAnimationFrame(endGame);
    }
}

// Create game objects
const conveyor = new Conveyor();
const motorCollector = new Collector(150, 50, 100, 50, 1, "Motors", 5);
const wheelCollector = new Collector(300, 500, 100, 50, -1, "Wheels", 4);
/**
 * @type {Part[]}
 */
var parts = [];

const partLists = {"Motors": "motorSprite.png", "Wheels": "wheelSprite.png"};

function increaseGameSpeed() {
    if(gameSpeed > 4) return;

    gameSpeed += 1;
    conveyor.updateGameSpeed(gameSpeed);
    parts.forEach(part => part.updateGameSpeed(gameSpeed));

    console.log("Increased game speed to " + gameSpeed);
}

function startGame() {
    // Clear the canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    times = 0;
    gameSpeed = 3;
    conveyor.updateGameSpeed(gameSpeed);
    score = 0;
    lives = 4;

    requestAnimationFrame(doGameLogic);
}

function doGameLogic() {
    // Clear the canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    times += 1;
    if (times % 1500 == 0) increaseGameSpeed();

    // Spawn the parts
    if (times % (300 / gameSpeed) == 0) {
        const randomName = Object.keys(partLists)[Math.floor(Math.random() * Object.keys(partLists).length)];
        const part = new Part(-100, 300 - (50/2), 50, 50, gameSpeed, randomName, "../images/" + partLists[randomName]);
        parts.push(part);
    }

    // Update the game objects
    conveyor.update();
    motorCollector.update(parts);
    wheelCollector.update(parts);
    parts.forEach(part => part.update());

    const partsToRemove = [];
    parts.forEach(part => {
        if (part.isOutside()) {
            partsToRemove.push(part);
            lives -= 1;
        } else if (part.doesNeedsToBeDeleted()) {
            partsToRemove.push(part);
        }
    });
    parts = parts.filter(part => !partsToRemove.includes(part));

    score += motorCollector.getNotCountedScore();
    score += wheelCollector.getNotCountedScore();

    // Draw the game
    conveyor.draw();
    motorCollector.draw();
    wheelCollector.draw();
    parts.forEach(part => part.draw());
    drawTrashBin();

    // Draw the score
    gameContext.fillStyle = "#FFFFFF";
    gameContext.font = "30px Arial";
    gameContext.textAlign = "left";
    gameContext.fillText("Score: " + score, 10, 20);

    // Todo: Draw the battery (lives)

    console.log(lives)

    if(lives == 0) return endGame(true);

    if (isGamePlaying) requestAnimationFrame(doGameLogic);
}

function drawTrashBin() {
    gameContext.fillStyle = "#6B8665";
    gameContext.fillRect(610, 175, 150, 250);
    gameContext.strokeStyle = "#485c44";
    gameContext.lineWidth = 10;
    gameContext.strokeRect(610, 175, 150, 250);

    gameContext.textAlign = "center";
    gameContext.fillStyle = "#485c44";
    gameContext.font = "90px Arial";
    gameContext.fillText("♲", 610 + (150 / 2), 175 + (250 / 2));
}