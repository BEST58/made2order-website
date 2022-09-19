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

// Wait until the user clicks the canvas to start the game
gameCanvas.addEventListener("click", function () {
    // Start the game
    if (!isGamePlaying) {
        requestAnimationFrame(fadeOut);
    } else {
        motorCollector.clicked();
        wheelCollector.clicked();
    }
});

function fadeOut() {
    isGamePlaying = true;

    if (gameContext.globalAlpha > 0.01) {
        const oldAlpha = gameContext.globalAlpha;
        gameContext.globalAlpha = 1;
        gameContext.fillStyle = "#FFFFFF";
        gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameContext.globalAlpha = oldAlpha;

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
        gameContext.fillStyle = "#FFFFFF";
        gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        setTimeout(() => {
            startGame();
        }, 300);
    }
}

// Create game objects
const conveyor = new Conveyor();
const motorCollector = new Collector(150, 50, 100, 50, 1, "Motors");
const wheelCollector = new Collector(300, 500, 100, 50, -1, "Wheels");

function increaseGameSpeed() {
    gameSpeed += 1;
    conveyor.updateGameSpeed(gameSpeed);

    console.log("Increased game speed to " + gameSpeed);
}

function startGame() {
    // Clear the canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    requestAnimationFrame(doGameLogic);
}

function doGameLogic() {
    // Clear the canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    times += 1;
    if (times % 1000 == 0) increaseGameSpeed();

    // Update the game objects
    conveyor.update();
    motorCollector.update();
    wheelCollector.update();

    // Draw the game
    conveyor.draw();
    motorCollector.draw();
    wheelCollector.draw();
    drawTrashBin();

    // Update the score:
    score = 0;
    score += motorCollector.amount * 3;

    // Draw the score
    gameContext.fillStyle = "#000000";
    gameContext.font = "30px Arial";
    gameContext.textAlign = "left";
    gameContext.fillText("Score: " + score, 10, 20);

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