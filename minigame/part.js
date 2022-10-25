class Part {
    constructor(x, y, width, height, speed, name, imagePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.name = name;
        this.image = new Image();
        this.image.src = imagePath;
        this.parent = null;
        this.toBeDeleted = false;
    }

    updateGameSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    update() {
        if(this.parent == null) {
            this.x += this.speed;
            return;
        }

        this.x = this.parent.armX + (30 / 2) - (this.width / 2);

        const oldY = this.y;
        if(this.parent.direction == 1) {
            this.y = this.parent.armY + this.parent.armHeight;
        } else {
            this.y = this.parent.armY + this.parent.armHeight - this.height / 2;
        }
        if(oldY == this.y) {
            this.toBeDeleted = true;
        }
    }

    draw() {
        gameContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    /**
     * @param {Collector} collector 
     */
    setHoldingParent(collector) {
        this.parent = collector;
    }

    isOutside() {
        return this.x > 600;
    }

    doesNeedsToBeDeleted() {
        return this.toBeDeleted;
    }

}