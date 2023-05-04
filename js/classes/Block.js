// Path : js\classes\Block.js

class Block {
    constructor(name = "default", texture = "block-default.png") {
        this.name = name;
        this.texture = texture;
    }

    displayData() {
        console.log("Name: " + this.name);
        console.log("Texture: " + this.texture);
    }
}