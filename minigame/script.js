// Get the canvas
const gameCanvas = document.getElementById("gameCanvas");
// Get the context
const gameContext = gameCanvas.getContext("2d");

if (document.body.clientWidth < 800) {
    gameCanvas.width = document.body.clientWidth - 100;
    gameCanvas.height = 200;

    gameContext.fillStyle = "#000000";
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameContext.font = "30px Consolas,monaco,monospace";
    gameContext.fillStyle = "#FFFFFF";
    gameContext.textAlign = "center";
    gameContext.textBaseline = "middle";
    gameContext.fillText("Sorry, not compatible", gameCanvas.width / 2, gameCanvas.height / 2 - 20);
    gameContext.fillText("with mobile devices.", gameCanvas.width / 2, gameCanvas.height / 2 + 20);
} else {
    // Set the canvas width and height
    gameCanvas.width = 800;
    gameCanvas.height = 600;

    // Welcome Screen
    gameContext.fillStyle = "#000000";
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameContext.font = "30px Consolas,monaco,monospace";
    gameContext.fillStyle = "#FFFFFF";
    gameContext.textAlign = "center";
    gameContext.textBaseline = "middle";
    gameContext.fillText("RoboSort", gameCanvas.width / 2, gameCanvas.height / 2);

    var isGamePlaying = false;
    var times = 0;
    var gameSpeed = 1;
    var score = 0;
    var lives = 4;
    var gameStartTime = new Date();
    var timeLeft = 0;

    // Wait until the user clicks the canvas to start the game
    gameCanvas.addEventListener("click", function (event) {
        // Start the game
        if (!isGamePlaying) {
            requestAnimationFrame(fadeOut);
        } else {
            // Check if the user clicked on a controller
            motorCollector.isMouseOver(event.offsetX, event.offsetY);
            wheelCollector.isMouseOver(event.offsetX, event.offsetY);
            gearCollector.isMouseOver(event.offsetX, event.offsetY);
            batteryCollector.isMouseOver(event.offsetX, event.offsetY);
        }
    });

    window.addEventListener('keydown', e => {
        if (isGamePlaying) {
            switch (e.key) {
                case "1":
                    motorCollector.clicked();
                    break;
                case "2":
                    batteryCollector.clicked();
                    break;
                case "3":
                    gearCollector.clicked();
                    break;
                case "4":
                    wheelCollector.clicked();
                    break;
                case "ArrowUp":
                    if (gameSpeed < 5) setGameSpeed(gameSpeed + 1);
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    if (gameSpeed > 1) setGameSpeed(gameSpeed - 1);
                    e.preventDefault();
                    break;
            }
        }
    })

    function fadeOut() {
        isGamePlaying = true;

        if (gameContext.globalAlpha > 0.01) {
            gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

            gameContext.fillStyle = "#000000";
            gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            gameContext.font = "30px Consolas,monaco,monospace";
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
        if (isGamePlaying) {
            parts = [];
            gameContext.globalAlpha = 0;
            console.log("game ending")
        }

        isGamePlaying = false;

        if (gameContext.globalAlpha < 1) {
            gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

            gameContext.fillStyle = "#000000";
            gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            gameContext.font = "30px Consolas,monaco,monospace";
            gameContext.fillStyle = "#FFFFFF";
            gameContext.textAlign = "center";
            gameContext.textBaseline = "middle";
            gameContext.fillText("Game Over", gameCanvas.width / 2, gameCanvas.height / 2 - 40);

            gameContext.font = "22px Consolas,monaco,monospace";
            gameContext.fillText("Click to Restart", gameCanvas.width / 2, gameCanvas.height / 2);

            gameContext.fillText("Score: " + score, gameCanvas.width / 2, gameCanvas.height / 2 + 40);

            gameContext.globalAlpha += 0.01;
            if (gameContext.globalAlpha >= 0.99) gameContext.globalAlpha = 1
            requestAnimationFrame(endGame);
        }
    }

    // Create game objects
    const conveyor = new Conveyor();
    const motorCollector = new Collector(150, 50, 100, 50, 1, "Motors", 5);
    const wheelCollector = new Collector(350, 500, 100, 50, -1, "Wheels", 4);
    const gearCollector = new Collector(150, 500, 100, 50, -1, "Gears", 4);
    const batteryCollector = new Collector(350, 50, 100, 50, 1, "Battery", 1);

    /**
     * @type {Part[]}
     */
    var parts = [];

    var prevPart = "";

    const partLists = { "Motors": "motorSprite.png", "Wheels": "wheelSprite.png", "Gears": "gearSprite.png" };

    function setGameSpeed(newSpeed) {
        gameSpeed = newSpeed;
        conveyor.updateGameSpeed(gameSpeed);
        parts.forEach(part => part.updateGameSpeed(gameSpeed));

        console.log("Increased game speed to " + gameSpeed);
    }

    function startGame() {
        // Clear the canvas
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameStartTime = new Date();

        motorCollector.reset();
        wheelCollector.reset();
        gearCollector.reset();
        batteryCollector.reset();

        times = 0;
        gameSpeed = 1;
        conveyor.updateGameSpeed(gameSpeed);
        score = 0;
        lives = 4;

        requestAnimationFrame(doGameLogic);
    }

    const batteryImage = new Image();
    batteryImage.src = "../images/battery.png"

    function doGameLogic() {
        // Clear the canvas
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        times += 1;
        if (times % 5000 == 0) lives -= 1;

        if (times % 50 == 0) {
            timeLeft = new Date().getTime() - gameStartTime.getTime();
            if (timeLeft > 90000) {
                lives -= 1;
            }
        }

        // Spawn the parts
        if (times % (300 / gameSpeed) == 0) {
            if (lives <= 3 && Math.random() <= 0.13) {
                const batteryPart = new Part(-100, 300 - (50 / 2), 50, 50, gameSpeed, "Battery", "../images/batterySprite.png");
                parts.push(batteryPart);
            } else {
                var randomName = Object.keys(partLists)[Math.floor(Math.random() * Object.keys(partLists).length)];
                while (randomName == prevPart) {
                    randomName = Object.keys(partLists)[Math.floor(Math.random() * Object.keys(partLists).length)];
                }
                prevPart = randomName;
                const part = new Part(-100, 300 - (50 / 2), 50, 50, gameSpeed, randomName, "../images/" + partLists[randomName]);
                parts.push(part);
            }
        }

        // Update the game objects
        conveyor.update();
        motorCollector.update(parts);
        wheelCollector.update(parts);
        gearCollector.update(parts);
        batteryCollector.update(parts);
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
        score += gearCollector.getNotCountedScore();
        lives += batteryCollector.getNotCountedScore();

        // Draw the game
        conveyor.draw();
        motorCollector.draw();
        wheelCollector.draw();
        gearCollector.draw();
        batteryCollector.draw();
        parts.forEach(part => part.draw());
        motorCollector.drawArm();
        wheelCollector.drawArm();
        gearCollector.drawArm();
        batteryCollector.drawArm();
        drawTrashBin();

        // Draw the score
        gameContext.fillStyle = "#FFFFFF";
        gameContext.font = "30px Consolas,monaco,monospace";
        gameContext.textAlign = "left";
        gameContext.fillText("Score: " + score, 10, 20);

        // Draw the time left
        gameContext.fillText(`${millisToMinutesAndSeconds(timeLeft)}`, 600, 33);

        // Draw the speed:
        gameContext.fillText(`Speed: ${gameSpeed}x`, 600, 550);

        // Todo: Draw the battery (lives)
        if (lives == 0) return endGame(true);

        gameContext.drawImage(batteryImage, 10 + ((lives - 1) * 125), 60, 108, 160, 560, 10, 30, 43);

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
        gameContext.font = "90px Consolas,monaco,monospace";
        gameContext.fillText("♲", 610 + (150 / 2), 175 + (250 / 2));
    }

    function millisToMinutesAndSeconds(millis) {
        millis = 90000 - millis;
        var minutes = Math.floor(millis / 60000);
        var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
        if (seconds < 0) return "0:00";
        return (minutes) + ":" + (seconds < 10 ? '0' : '') + (seconds);
    }
}