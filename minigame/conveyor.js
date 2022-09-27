class Conveyor {
    constructor() {
        this.x = 0;
        this.y = 200;
        this.width = 600;
        this.height = 200;
        this.conveyorLines = [];

        for (let i = 0; i < this.width / 40; i++) {
            this.conveyorLines.push(new ConveyorLine(i * 40, this.y, 5, this.height));
        }
    }

    updateGameSpeed(value) {
        for (let i = 0; i < this.conveyorLines.length; i++) {
            this.conveyorLines[i].updateGameSpeed(value);
        }
    }

    update() {
        // if the conveyor line is past the end of the screen, reset it
        for (let i = 0; i < this.conveyorLines.length; i++) {
            const line = this.conveyorLines[i];
            line.update();

            if(line.x + line.width > this.width) {
                line.x = this.x;
            }
        }
    }

    draw() {
        gameContext.fillStyle = "#2D2D2D";
        gameContext.fillRect(0, this.y, this.width, this.height);

        for (let i = 0; i < this.conveyorLines.length; i++) {
            const line = this.conveyorLines[i];
            line.draw();
        }
    }
}

class ConveyorLine {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 1;
    }

    updateGameSpeed(value) {
        this.speed = value;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        gameContext.fillStyle = "#5D5D5D";
        gameContext.fillRect(this.x, this.y, this.width, this.height);
        
        gameContext.strokeStyle = "#0A0A0A";
        gameContext.lineWidth = 2;
        gameContext.strokeRect(this.x, this.y + 2, this.width, this.height - 4);
    }
}