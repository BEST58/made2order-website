class Conveyor {
    constructor() {
        this.x = 0;
        this.y = 200;
        this.width = 600;
        this.height = 200;
        this.conveyorLines = [];
        this.conveyorImage = new Image();
        this.conveyorImage.src = "../images/belt.png";
        this.conveyorLineImage = new Image();
        this.conveyorLineImage.src = "../images/separator.png";

        for (let i = 0; i < this.width / 40; i++) {
            this.conveyorLines.push(new ConveyorLine(i * 40, this.y, 7, this.height, this.conveyorLineImage));
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
        gameContext.drawImage(this.conveyorImage, 0, this.y, this.width, this.height)

        for (let i = 0; i < this.conveyorLines.length; i++) {
            const line = this.conveyorLines[i];
            line.draw();
        }
    }
}

class ConveyorLine {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 1;
        this.image = image;
    }

    updateGameSpeed(value) {
        this.speed = value;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        gameContext.drawImage(this.image, this.x, this.y, this.width, this.height)

        // gameContext.fillStyle = "#5D5D5D";
        // gameContext.fillRect(this.x, this.y, this.width, this.height);
        
        // gameContext.strokeStyle = "#0A0A0A";
        // gameContext.lineWidth = 2;
        // gameContext.strokeRect(this.x, this.y + 2, this.width, this.height - 4);
    }
}