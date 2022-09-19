class Collector {
    constructor(x, y, width, height, direction, name, scoreAmount) {
        this.x = x;
        this.y = y;
        this.armX = x + (width / 2 - 10);
        this.armY = y + (height / 2 - 10);
        this.armHeight = 20 * direction;

        this.width = width;
        this.height = height;
        this.direction = direction;
        this.name = name;
        this.animationPos = -1;
        this.amount = 0;

        this.scoreToSave = 0;
        this.scoreAmount = scoreAmount;
    }

    clicked() {
        if (this.animationPos == -1) {
            this.animationPos = 0;
        }
    }

    isMouseOver(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            this.clicked();
        }
    }

    getNotCountedScore() {
        const oldScore = this.scoreToSave;
        this.scoreToSave = 0;
        return oldScore;
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
            this.scoreToSave += this.scoreAmount;
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
        gameContext.fillText(this.name + ": " + this.amount, this.x + this.width / 2, this.y + this.height * this.direction + (this.direction == 1 ? 40 : 10));

        gameContext.fillRect(this.armX, this.armY + (this.direction == -1 ? 20 : 0), 20, this.armHeight);
    }
}