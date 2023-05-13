// Path : js\classes\Builder.js

class Builder {
    constructor(dX, dY, dZ) {
        this.blockManager = new BlockManager();
        this.blockWidth = 64;
        this.blockHeight = 64;
        this.gridColor = "#43454d";
        this.gridActiveColor = "#36d3ff";
        this.dX = dX;
        this.dY = dY;
        this.dZ = dZ;
        this.viewMode = false;
        this.selectedBlock = new Block();
        this.setSelectedBlock(document.getElementsByClassName('block')['0'].id.split('-')[1]);
        this.pencilMode = "pencil";
        this.rectangleFirstTile = null;
        this.rectangleLastTile = null;

        this.blocks = this.makeGrid();
        document.getElementById("input-active-layer").setAttribute("max", this.dZ - 1);
        this.canvas = document.getElementById("canvas-builder");
        this.ctx = this.canvas.getContext("2d");
        this.jsonLoader = document.getElementById("json-loader");
        this.update();

        this.canvas.addEventListener("mousemove", (e) => {
            if(! this.viewMode) {
                let pos = this.getMousePos(e);
                let tilePos = this.getSelectedTile(pos['x'], pos['y']);
                this.draw();
                this.highlightTile(tilePos["x"], tilePos["y"], tilePos["z"]);
                this.preview(tilePos["x"], tilePos["y"], tilePos["z"]);
            }
        });

        this.canvas.addEventListener("mouseout", (e) => {
            if(! this.viewMode) {
               this.draw();
            }
        });
        
        this.canvas.addEventListener("mousedown", (e) => {
            if(! this.viewMode) {
                let pos = this.getMousePos(e);
                let tilePos = this.getSelectedTile(pos['x'], pos['y']);
                this.place(tilePos["x"], tilePos["y"], tilePos["z"]);
                this.draw();
            }
        });

        this.jsonLoader.onchange = e => { 
            let file = e.target.files[0];
            this.loadJson(file);
        }
    }

    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: parseInt(e.clientX - rect.left),
          y: parseInt(e.clientY - rect.top)
        };
    }

    update() {
        this.zoom = document.getElementById("input-zoom").value;
        this.canvas.width = (this.dX + this.dY)* 0.5 * this.blockWidth * this.zoom;
        this.canvas.height = 0.5 * this.canvas.width + 0.5 * this.dZ * this.blockHeight * this.zoom;
        this.origin = {"x" : 0.5 * this.dX * this.blockWidth * this.zoom, "y" : this.canvas.height - this.canvas.width * 0.5 };
        this.tilesPositions = this.getTilesPositions();
        this.activeLayer = parseInt(document.getElementById("input-active-layer").value);
        this.draw();
        if (document.getElementById("canvas-container").offsetWidth > this.canvas.width) {
            document.getElementById("canvas-wrapper").style.justifyContent = "center";
        } else {
            document.getElementById("canvas-wrapper").style.justifyContent = "";
        }
    }

    makeGrid() {
        var arrX = [];
        for(let i = 0; i < this.dX; i++) {
            let arrY = [];
            for (let j = 0; j < this.dY; j++) {
                arrY.push(new Array(this.dZ));
            }
            arrX.push(arrY);
        }
        return arrX;
    }

    drawBlockLayer(level = 0, active = false) {
        this.ctx.globalAlpha = (active)? 1 : 0.5;
        for (let i = 0; i < this.dX; i++) {
            for (let j = 0; j < this.dY; j++) {
                if (this.blocks[level][j][i] != undefined) {
                    this.ctx.drawImage(this.blocks[level][j][i].image, this.tilesPositions[level][j][i]["x"]  - 0.5 * this.blockWidth * this.zoom, this.tilesPositions[level][j][i]["y"]  - 0.75 * this.blockHeight * this.zoom, this.blocks[level][j][i].width * this.zoom, this.blocks[level][j][i].height * this.zoom);
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    drawLayer(level = 0, active = false) {
        
        let color = (active)? this.gridActiveColor : this.gridColor;
        let lineWidth = (active)? 2 : 1;
        this.ctx.strokeStyle = color;

        let coordStart = {"x" : this.origin["x"], "y" : this.origin["y"] - level * 0.5 * this.blockHeight * this.zoom};

        for (let i = 0; i <= this.dY; i++) {
            let coordDest = {"x" : coordStart["x"] - 0.5 * this.dX * this.blockWidth * this.zoom, "y" : coordStart["y"] + 0.25 * this.dX * this.blockWidth * this.zoom};
            this.ctx.beginPath();
            this.ctx.moveTo(coordStart["x"], coordStart["y"]);
            this.ctx.lineTo(coordDest["x"], coordDest["y"]);
            this.ctx.closePath();
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
            coordStart["x"] += 0.5 * this.blockWidth * this.zoom;
            coordStart["y"] += 0.25 * this.blockWidth * this.zoom;
        }

        coordStart = {"x" : this.origin["x"], "y" : this.origin["y"] - level * 0.5 * this.blockHeight * this.zoom};
        for (let i = 0; i <= this.dX; i++) {
            let coordDest = {"x" : coordStart["x"] + 0.5 * this.dY * this.blockWidth * this.zoom, "y" : coordStart["y"] + 0.25 * this.dY * this.blockWidth * this.zoom};
            this.ctx.beginPath();
            this.ctx.moveTo(coordStart["x"], coordStart["y"]);
            this.ctx.lineTo(coordDest["x"], coordDest["y"]);
            this.ctx.closePath();
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
            coordStart["x"] -= 0.5 * this.blockWidth * this.zoom;
            coordStart["y"] += 0.25 * this.blockWidth * this.zoom;
        }         
    }

    draw() {
        this.clear();
        if (! this.viewMode) {
            for (let i = 0; i < this.dZ; i ++) {
                if (i != this.activeLayer) {
                    this.drawLayer(i);
                }
            }
            for (let i = 0; i < this.dZ; i ++) {
                if (i != this.activeLayer) {
                    this.drawBlockLayer(i);
                }
            }
            this.drawLayer(this.activeLayer, true);
            this.drawBlockLayer(this.activeLayer, true);
        } else {
            for (let i = 0; i < this.dZ; i ++) {
                    this.drawBlockLayer(i, true);
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    selectLayer(level) {
        this.activeLayer = level;
        this.draw();
    }

    getTilesPositions() {
        let arrZ = [];
        for (let i = 0; i < this.dZ; i++) {
            let posXLayer = this.origin.x;
            let posYLayer = this.origin.y - i * 0.5 * this.blockHeight * this.zoom;
            let arrY = [];
            for(let j = 0; j <  this.dY; j++) {
                let posX = posXLayer + j * 0.5 * this.blockWidth * this.zoom;
                let posY = posYLayer + j * 0.25 * this.blockHeight * this.zoom
                let arrX = [];
                for (let k = 0; k < this.dX; k++) {
                    posY += 0.25 * this.blockHeight * this.zoom;
                    arrX.push({"x" : posX, "y" : posY})
                    posX -= 0.5 * this.blockWidth * this.zoom;
                }
                arrY.push(arrX);
            }
            arrZ.push(arrY);
        }
        return arrZ;
    }

    getSelectedTile(x, y) {
        let resX = 0;
        let resY = 0;
        let bestDistance = getDistance(x, y, this.tilesPositions[this.activeLayer][0][0]["x"], this.tilesPositions[this.activeLayer][0][0]["y"]);
        for (let i = 0; i < this.dY; i++) {
            for (let j = 0; j < this.dX; j++) {
                let distanceTmp = getDistance(x, y, this.tilesPositions[this.activeLayer][i][j]["x"], this.tilesPositions[this.activeLayer][i][j]["y"]);
                if (distanceTmp < bestDistance) {
                    bestDistance = distanceTmp;
                    resX = j;
                    resY = i;
                }
            }
        }
        return {"x" : resX, "y" : resY, "z" : this.activeLayer};
    }

    highlightTile(x, y, z) {
        let pos = this.tilesPositions[z][y][x];
        this.ctx.beginPath();
        this.ctx.moveTo(pos["x"], pos["y"] - 0.25 * this.blockHeight * this.zoom);
        this.ctx.lineTo(pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"]);
        this.ctx.lineTo(pos["x"], pos["y"] + 0.25 * this.blockHeight * this.zoom);
        this.ctx.lineTo(pos["x"] + 0.5 * this.blockWidth * this.zoom, pos["y"]);
        this.ctx.lineTo(pos["x"], pos["y"] - 0.25 * this.blockHeight * this.zoom);
        this.ctx.closePath();
        this.ctx.fillStyle = this.gridActiveColor;
        this.ctx.fill();
    }

    preview(x, y, z) {
        this.ctx.globalAlpha = 0.5;
        let pos = this.tilesPositions[z][y][x];
        let blockEraser = new Block();

        switch (this.pencilMode) {
            case "rectangle":
                if(this.rectangleFirstTile != null && this.rectangleLastTile == null) {
                    for (let i = 0; i < this.dY; i++) {
                        for (let j = 0; j < this.dX; j++) {
                            if (i >= Math.min(this.rectangleFirstTile["y"], y) && i <= Math.max(this.rectangleFirstTile["y"], y) && j >= Math.min(this.rectangleFirstTile["x"], x) && j <= Math.max(this.rectangleFirstTile["x"], x)) {
                                let posTmp = this.tilesPositions[z][i][j];
                                this.ctx.drawImage(this.selectedBlock.image, posTmp["x"] - 0.5 * this.blockWidth * this.zoom, posTmp["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                            }
                        }
                    }
                    
                } else {
                    this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                }
                break;
            case "eye-dropper":
                break;
            case "filler":
                for (let i = 0; i < this.dY; i++) {
                    for (let j = 0; j < this.dX; j++) {
                        if (this.blocks[z][i][j] == null) {
                            let posTmp = this.tilesPositions[z][i][j];
                            this.ctx.drawImage(this.selectedBlock.image, posTmp["x"] - 0.5 * this.blockWidth * this.zoom, posTmp["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                        }
                    }
                }
                break;
            case "eraser":
                this.ctx.drawImage(blockEraser.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                break;
            case "eraser-layer":
                for (let i = 0; i < this.dY; i++) {
                    for (let j = 0; j < this.dX; j++) {
                        let posTmp = this.tilesPositions[z][i][j];
                        this.ctx.drawImage(blockEraser.image, posTmp["x"] - 0.5 * this.blockWidth * this.zoom, posTmp["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                    }
                }
                break;
            default:
                this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
            }
        this.ctx.globalAlpha = 1; 
    }

    place(x, y, z) {
        switch (this.pencilMode) {
            case "eraser":
                this.blocks[z][y][x] = undefined;
                break;
            case "eye-dropper":
                if (this.blocks[z][y][x] != null) {
                    this.setSelectedBlock(this.blocks[z][y][x].id);
                    this.setPencilMode("pencil");
                } else {
                    this.setPencilMode("eraser");
                }
                break;
            case "rectangle":
                if (this.rectangleFirstTile == null) {
                    this.rectangleFirstTile = {"x" : x, "y" : y, "z" : z};
                    this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
                } else
                if(this.rectangleFirstTile != null && this.rectangleLastTile == null) {
                    this.rectangleLastTile = {"x" : x, "y" : y, "z" : z};

                    for (let i = 0; i < this.dY; i++) {
                        for (let j = 0; j < this.dX; j++) {
                            if (i >= Math.min(this.rectangleFirstTile["y"], this.rectangleLastTile["y"]) && i <= Math.max(this.rectangleFirstTile["y"], this.rectangleLastTile["y"]) && j >= Math.min(this.rectangleFirstTile["x"], this.rectangleLastTile["x"]) && j <= Math.max(this.rectangleFirstTile["x"], this.rectangleLastTile["x"])) {
                                this.blocks[z][i][j] = this.selectedBlock;
                            }
                        }
                    }

                    this.rectangleFirstTile = null;
                    this.rectangleLastTile = null;
                }
                break;
            case "filler":
                for (let i = 0; i < this.dY; i++) {
                    for (let j = 0; j < this.dX; j++) {
                        if (this.blocks[z][i][j] == null) {
                            this.blocks[z][i][j] = this.selectedBlock;
                        }
                    }
                }
                break;
            case "eraser-layer":
                for (let i = 0; i < this.dY; i++) {
                    for (let j = 0; j < this.dX; j++) {
                        this.blocks[z][i][j] = null;
                    }
                }
                break;
            default:
                this.blocks[z][y][x] = this.selectedBlock;
            }
    }


    switchViewMode() {
        let icon = document.getElementById("input-view-mode-icon");
        this.viewMode = ! this.viewMode;
        if(this.viewMode) {
            icon.setAttribute("src", "assets/icons/box.svg");
        }
        else {
            icon.setAttribute("src", "assets/icons/eye.svg");
        }
        this.draw();
    }

    setSelectedBlock(blockId) {
        if (this.selectedBlock.id != 0) {
            document.getElementById("block-" + this.selectedBlock.id).classList.remove("selected");        
        }
        this.selectedBlock = this.blockManager.getBlock(blockId);
        document.getElementById("block-" + this.selectedBlock.id).classList.add("selected");
    }

    setZoom(z) {
        this.zoom = document.getElementById("input-zoom").value = z;
        this.update();
    }

    export() {
        let tmpViewMode = this.viewMode;
        this.viewMode = true;
        let tmpZoom = this.zoom;
        this.setZoom(1);
        this.draw();

        let link = document.createElement('a');
        link.download = 'export-' + getDateTime() + '.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();

        this.viewMode = tmpViewMode;
        this.setZoom(tmpZoom);
        this.update();
        this.draw();
    }

    saveJson() {
        let formatBlocks = [];
        for(let i = 0; i < this.dZ; i++) {
            let formatBlocksY = [];
            for(let j = 0; j < this.dY; j++) {
                let formatBlocksX = [];
                for(let k = 0; k < this.dX; k++) {
                    if(this.blocks[i][j][k] != undefined) {
                        formatBlocksX.push(this.blocks[i][j][k].id);
                    }
                    else {
                        formatBlocksX.push(0);
                    }
                }
                formatBlocksY.push(formatBlocksX);
            }
            formatBlocks.push(formatBlocksY);
        }
        console.log(formatBlocks)
        let data = {
            "dX" : this.dX,
            "dY" : this.dY,
            "dZ" : this.dZ,
            "blocks" : formatBlocks
        }
        let link = document.createElement('a');
        link.download = 'project-' + getDateTime() + '.json';
        link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        link.click();
    }

    loadJson(file) {
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');
            reader.onload = readerEvent => {
                let content = readerEvent.target.result;
                let data = JSON.parse(content);
                this.dX = data.dX;
                this.dY = data.dY;
                this.dZ = data.dZ;
                this.blocks = [];
                for(let i = 0; i < this.dZ; i++) {
                    let blocksY = [];
                    for(let j = 0; j < this.dY; j++) {
                        let blocksX = [];
                        for(let k = 0; k < this.dX; k++) {
                            blocksX.push(this.blockManager.getBlock(data.blocks[i][j][k]));
                        }
                        blocksY.push(blocksX);
                    }
                    this.blocks.push(blocksY);
                }

                this.viewMode = false;
                this.switchViewMode();
                this.activeLayer = 0;
                this.setZoom(1);
                this.draw();
            }
    }

    setPencilMode(mode) {
        this.rectangleFirstTile = null;
        this.rectangleLastTile = null;
        document.getElementById("tool-" + this.pencilMode).classList.remove("selected");        
        this.pencilMode = mode;
        document.getElementById("tool-" + this.pencilMode).classList.add("selected");        
    }
}