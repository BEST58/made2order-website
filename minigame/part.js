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
    }

    updateGameSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        gameContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isOutside() {
        return this.x > 600;
    }

}