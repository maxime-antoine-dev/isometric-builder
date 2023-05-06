// Path : js\classes\Block.js

class Block {
    constructor(id = 0, texture = "empty-block.png", width = 64, height = 64) {
        this.width = width;
        this.height = height;
        this.id = id;
        this.texture = texture;
        this.image = createImage("./assets/textures/blocks/" + this.texture);
    }

    displayData() {
        console.log("Id: " + this.id);
        console.log("Texture: " + this.texture);
        console.log(this.image);
    }
}