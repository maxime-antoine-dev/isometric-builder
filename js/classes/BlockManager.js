// Path : js\classes\BlockManager.js

class BlockManager {
    constructor() {
        this.blocks = [];
        let blocksTmp = $.retriveBlocks();
        for (let i = 0; i < blocksTmp.length; i++) {
            this.blocks[blocksTmp[i].id] = new Block(blocksTmp[i].id, blocksTmp[i].texture, blocksTmp[i].width, blocksTmp[i].height);
        }
    }

    getBlock(id){
        if (id == 0 || this.blocks[id] == null || this.blocks[id] == undefined) {
            return null
        } else {
            return this.blocks[id];
        }
    }
}