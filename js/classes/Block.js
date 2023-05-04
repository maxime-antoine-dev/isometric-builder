// Path : js\classes\Block.js

class Block {
    constructor(name = "default", texture = "block-default.png") {
        this.name = name;
        this.texture = texture;
        this.image = createImage("./assets/textures/blocks/" + this.texture);
    }

    displayData() {
        console.log("Name: " + this.name);
        console.log("Texture: " + this.texture);
        console.log(this.image);
    }
}