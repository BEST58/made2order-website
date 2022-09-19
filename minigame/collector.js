class Collector {
    constructor(x, y, width, height, direction, name) {
        this.x = x;
        this.y = y;
        this.armX = x + (width / 2 - 10);
        this.armY = y + (height / 2 - 10);
        this.armHeight = 20;

        this.width = width;
        this.height = height;
        this.direction = direction;
        this.name = name;
        this.animationPos = -1;
        this.amount = 0;
    }

    clicked() {
        if (this.animationPos == -1) {
            this.animationPos = 0;
        }
    }

    update() {
        if (this.animationPos >= 0 && this.animationPos < 50) {
            this.animationPos += 1;
            this.armHeight += this.direction * 4.5;
        } else if (this.animationPos >= 50 && this.animationPos < 100) {
            this.animationPos += 1;
            this.armHeight -= this.direction * 4.5;
        } else if (this.animationPos >= 100) {
            this.animationPos = -1;
            this.amount += 1;
        }
    }

    draw() {
        gameContext.fillStyle = "#5D5D5D";
        gameContext.fillRect(this.x, this.y, this.width, this.height);

        gameContext.fillStyle = "#3452eb";
        gameContext.strokeStyle = "#1b33ab";
        gameContext.lineWidth = 3;
        gameContext.fillRect(this.x, this.y + (this.height + 15) * this.direction, this.width, this.height);
        gameContext.strokeRect(this.x, this.y + (this.height + 15) * this.direction, this.width, this.height);

        gameContext.textAlign = "center";
        gameContext.fillStyle = "#DDDDDD";
        gameContext.font = "14px Arial";
        gameContext.fillText(this.name + ": " + this.amount, this.x + this.width / 2, this.y + this.height * this.direction + 20 + 20 * this.direction);

        gameContext.fillRect(this.armX, this.armY, 20, this.armHeight);
    }
}