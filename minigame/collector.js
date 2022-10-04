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
        this.heldPart = null;
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

    /**
     * 
     * @param {{x1: Number, x2: Number}} box1 
     * @param {{x1: Number, x2: Number}} box2
     * @returns {Boolean} if overlapping 1d
     */
    isOverlapping1D(box1,box2) {
        return (box1.x2 >= box2.x1 && box2.x2 >= box1.x1)
    }

    /**
     * 
     * @param {{x: {x1: Number, x2: Number}, y: {x1: Number, x2: Number}}} box1 
     * @param {{x: {x1: Number, x2: Number}, y: {x1: Number, x2: Number}}} box2     * @returns 
     * @returns {Boolean} if overlapping 2d
     */

    isOverlapping2D(box1,box2) {
        return (this.isOverlapping1D(box1.x, box2.x) && this.isOverlapping1D(box1.y, box2.y));
    }

    /**
     * @param {[Part]} partsOnBoard Parts on the conveyor belt.
     */
    update(partsOnBoard) {
        if(this.animationPos >= 0 && this.heldPart == null) {
            // Check to see if a part is touching.
            partsOnBoard.forEach(part => {
                if(part.name == this.name) {
                    const armY = this.direction == -1 ? (this.armY + 20 + this.armHeight) : (this.armY)
                    const armY2 = this.direction == 1 ? (this.armY + this.armHeight) : (this.armY)
                    if(this.isOverlapping2D(
                            {x: { x1: this.armX, x2: this.armX + 20 }, y: { x1: armY, x2: armY2 }},
                            {x: { x1: part.x, x2: part.x + part.width }, y: { x1: part.y, x2: part.y + part.height }}
                        )
                    ) {
                        part.setHoldingParent(this);
                        this.heldPart = part;
                    }
                }
            });
        }

        if (this.animationPos >= 0 && this.animationPos < 50) {
            this.animationPos += 1;
            this.armHeight += this.direction * 4.5;
        } else if (this.animationPos >= 50 && this.animationPos < 100) {
            this.animationPos += 1;
            this.armHeight -= this.direction * 4.5;
        } else if (this.animationPos >= 100) {
            this.animationPos = -1;
            if(this.heldPart != null) {
                this.amount += 1;
                this.scoreToSave += this.scoreAmount;
                this.heldPart = null;
            }
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