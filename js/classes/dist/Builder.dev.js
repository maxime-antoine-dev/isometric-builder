"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Path : js\classes\Builder.js
var Builder =
/*#__PURE__*/
function () {
  function Builder(dX, dY, dZ) {
    var _this = this;

    _classCallCheck(this, Builder);

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
    this.canvas.addEventListener("mousemove", function (e) {
      if (!_this.viewMode) {
        var _pos = _this.getMousePos(e);

        var tilePos = _this.getSelectedTile(_pos['x'], _pos['y']);

        _this.draw();

        _this.highlightTile(tilePos["x"], tilePos["y"], tilePos["z"]);

        _this.preview(tilePos["x"], tilePos["y"], tilePos["z"]);
      }
    });
    this.canvas.addEventListener("mouseout", function (e) {
      if (!_this.viewMode) {
        _this.draw();
      }
    });
    this.canvas.addEventListener("mousedown", function (e) {
      if (!_this.viewMode) {
        var _pos2 = _this.getMousePos(e);

        var tilePos = _this.getSelectedTile(_pos2['x'], _pos2['y']);

        _this.place(tilePos["x"], tilePos["y"], tilePos["z"]);

        _this.draw();
      }
    });

    this.jsonLoader.onchange = function (e) {
      var file = e.target.files[0];

      _this.loadJson(file);
    };
  }

  _createClass(Builder, [{
    key: "getMousePos",
    value: function getMousePos(e) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x: parseInt(e.clientX - rect.left),
        y: parseInt(e.clientY - rect.top)
      };
    }
  }, {
    key: "update",
    value: function update() {
      this.zoom = document.getElementById("input-zoom").value;
      this.canvas.width = (this.dX + this.dY) * 0.5 * this.blockWidth * this.zoom;
      this.canvas.height = 0.5 * this.canvas.width + 0.5 * this.dZ * this.blockHeight * this.zoom;
      this.origin = {
        "x": 0.5 * this.dX * this.blockWidth * this.zoom,
        "y": this.canvas.height - this.canvas.width * 0.5
      };
      this.tilesPositions = this.getTilesPositions();
      this.activeLayer = parseInt(document.getElementById("input-active-layer").value);
      this.draw();

      if (document.getElementById("canvas-container").offsetWidth > this.canvas.width) {
        document.getElementById("canvas-wrapper").style.justifyContent = "center";
      } else {
        document.getElementById("canvas-wrapper").style.justifyContent = "";
      }
    }
  }, {
    key: "makeGrid",
    value: function makeGrid() {
      var arrX = [];

      for (var i = 0; i < this.dX; i++) {
        var arrY = [];

        for (var j = 0; j < this.dY; j++) {
          arrY.push(new Array(this.dZ));
        }

        arrX.push(arrY);
      }

      return arrX;
    }
  }, {
    key: "drawBlockLayer",
    value: function drawBlockLayer() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.ctx.globalAlpha = active ? 1 : 0.5;

      for (var i = 0; i < this.dX; i++) {
        for (var j = 0; j < this.dY; j++) {
          if (this.blocks[level][j][i] != undefined) {
            this.ctx.drawImage(this.blocks[level][j][i].image, this.tilesPositions[level][j][i]["x"] - 0.5 * this.blockWidth * this.zoom, this.tilesPositions[level][j][i]["y"] - 0.75 * this.blockHeight * this.zoom, this.blocks[level][j][i].width * this.zoom, this.blocks[level][j][i].height * this.zoom);
          }
        }
      }

      this.ctx.globalAlpha = 1;
    }
  }, {
    key: "drawLayer",
    value: function drawLayer() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var color = active ? this.gridActiveColor : this.gridColor;
      var lineWidth = active ? 2 : 1;
      this.ctx.strokeStyle = color;
      var coordStart = {
        "x": this.origin["x"],
        "y": this.origin["y"] - level * 0.5 * this.blockHeight * this.zoom
      };

      for (var i = 0; i <= this.dY; i++) {
        var coordDest = {
          "x": coordStart["x"] - 0.5 * this.dX * this.blockWidth * this.zoom,
          "y": coordStart["y"] + 0.25 * this.dX * this.blockWidth * this.zoom
        };
        this.ctx.beginPath();
        this.ctx.moveTo(coordStart["x"], coordStart["y"]);
        this.ctx.lineTo(coordDest["x"], coordDest["y"]);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        coordStart["x"] += 0.5 * this.blockWidth * this.zoom;
        coordStart["y"] += 0.25 * this.blockWidth * this.zoom;
      }

      coordStart = {
        "x": this.origin["x"],
        "y": this.origin["y"] - level * 0.5 * this.blockHeight * this.zoom
      };

      for (var _i = 0; _i <= this.dX; _i++) {
        var _coordDest = {
          "x": coordStart["x"] + 0.5 * this.dY * this.blockWidth * this.zoom,
          "y": coordStart["y"] + 0.25 * this.dY * this.blockWidth * this.zoom
        };
        this.ctx.beginPath();
        this.ctx.moveTo(coordStart["x"], coordStart["y"]);
        this.ctx.lineTo(_coordDest["x"], _coordDest["y"]);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        coordStart["x"] -= 0.5 * this.blockWidth * this.zoom;
        coordStart["y"] += 0.25 * this.blockWidth * this.zoom;
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      this.clear();

      if (!this.viewMode) {
        for (var i = 0; i < this.dZ; i++) {
          if (i != this.activeLayer) {
            this.drawLayer(i);
          }
        }

        for (var _i2 = 0; _i2 < this.dZ; _i2++) {
          if (_i2 != this.activeLayer) {
            this.drawBlockLayer(_i2);
          }
        }

        this.drawLayer(this.activeLayer, true);
        this.drawBlockLayer(this.activeLayer, true);
      } else {
        for (var _i3 = 0; _i3 < this.dZ; _i3++) {
          this.drawBlockLayer(_i3, true);
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "selectLayer",
    value: function selectLayer(level) {
      this.activeLayer = level;
      this.draw();
    }
  }, {
    key: "getTilesPositions",
    value: function getTilesPositions() {
      var arrZ = [];

      for (var i = 0; i < this.dZ; i++) {
        var posXLayer = this.origin.x;
        var posYLayer = this.origin.y - i * 0.5 * this.blockHeight * this.zoom;
        var arrY = [];

        for (var j = 0; j < this.dY; j++) {
          var posX = posXLayer + j * 0.5 * this.blockWidth * this.zoom;
          var posY = posYLayer + j * 0.25 * this.blockHeight * this.zoom;
          var arrX = [];

          for (var k = 0; k < this.dX; k++) {
            posY += 0.25 * this.blockHeight * this.zoom;
            arrX.push({
              "x": posX,
              "y": posY
            });
            posX -= 0.5 * this.blockWidth * this.zoom;
          }

          arrY.push(arrX);
        }

        arrZ.push(arrY);
      }

      return arrZ;
    }
  }, {
    key: "getSelectedTile",
    value: function getSelectedTile(x, y) {
      var resX = 0;
      var resY = 0;
      var bestDistance = getDistance(x, y, this.tilesPositions[this.activeLayer][0][0]["x"], this.tilesPositions[this.activeLayer][0][0]["y"]);

      for (var i = 0; i < this.dY; i++) {
        for (var j = 0; j < this.dX; j++) {
          var distanceTmp = getDistance(x, y, this.tilesPositions[this.activeLayer][i][j]["x"], this.tilesPositions[this.activeLayer][i][j]["y"]);

          if (distanceTmp < bestDistance) {
            bestDistance = distanceTmp;
            resX = j;
            resY = i;
          }
        }
      }

      return {
        "x": resX,
        "y": resY,
        "z": this.activeLayer
      };
    }
  }, {
    key: "highlightTile",
    value: function highlightTile(x, y, z) {
      var pos = this.tilesPositions[z][y][x];
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
  }, {
    key: "preview",
    value: function preview(x, y, z) {
      this.ctx.globalAlpha = 0.5;
      var pos = this.tilesPositions[z][y][x];
      var blockEraser = new Block();

      switch (this.pencilMode) {
        case "rectangle":
          if (this.rectangleFirstTile != null && this.rectangleLastTile == null) {
            for (var i = 0; i < this.dY; i++) {
              for (var j = 0; j < this.dX; j++) {
                if (i >= Math.min(this.rectangleFirstTile["y"], y) && i <= Math.max(this.rectangleFirstTile["y"], y) && j >= Math.min(this.rectangleFirstTile["x"], x) && j <= Math.max(this.rectangleFirstTile["x"], x)) {
                  var posTmp = this.tilesPositions[z][i][j];
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
          for (var _i4 = 0; _i4 < this.dY; _i4++) {
            for (var _j = 0; _j < this.dX; _j++) {
              if (this.blocks[z][_i4][_j] == null) {
                var _posTmp = this.tilesPositions[z][_i4][_j];
                this.ctx.drawImage(this.selectedBlock.image, _posTmp["x"] - 0.5 * this.blockWidth * this.zoom, _posTmp["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
              }
            }
          }

          break;

        case "eraser":
          this.ctx.drawImage(blockEraser.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
          break;

        case "eraser-layer":
          for (var _i5 = 0; _i5 < this.dY; _i5++) {
            for (var _j2 = 0; _j2 < this.dX; _j2++) {
              var _posTmp2 = this.tilesPositions[z][_i5][_j2];
              this.ctx.drawImage(blockEraser.image, _posTmp2["x"] - 0.5 * this.blockWidth * this.zoom, _posTmp2["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
            }
          }

          break;

        default:
          this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
      }

      this.ctx.globalAlpha = 1;
    }
  }, {
    key: "place",
    value: function place(x, y, z) {
      switch (this.pencilMode) {
        case "eraser":
          this.blocks[z][y][x] = undefined;
          break;

        case "eye-dropper":
          if (this.blocks[z][y][x] != null) {
            this.selectedBlock = this.blocks[z][y][x];
            this.setPencilMode("pencil");
          } else {
            this.setPencilMode("eraser");
          }

          break;

        case "rectangle":
          if (this.rectangleFirstTile == null) {
            this.rectangleFirstTile = {
              "x": x,
              "y": y,
              "z": z
            };
            this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.selectedBlock.width * this.zoom, this.selectedBlock.height * this.zoom);
          } else if (this.rectangleFirstTile != null && this.rectangleLastTile == null) {
            this.rectangleLastTile = {
              "x": x,
              "y": y,
              "z": z
            };

            for (var i = 0; i < this.dY; i++) {
              for (var j = 0; j < this.dX; j++) {
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
          for (var _i6 = 0; _i6 < this.dY; _i6++) {
            for (var _j3 = 0; _j3 < this.dX; _j3++) {
              if (this.blocks[z][_i6][_j3] == null) {
                this.blocks[z][_i6][_j3] = this.selectedBlock;
              }
            }
          }

          break;

        case "eraser-layer":
          for (var _i7 = 0; _i7 < this.dY; _i7++) {
            for (var _j4 = 0; _j4 < this.dX; _j4++) {
              this.blocks[z][_i7][_j4] = null;
            }
          }

          break;

        default:
          this.blocks[z][y][x] = this.selectedBlock;
      }
    }
  }, {
    key: "switchViewMode",
    value: function switchViewMode() {
      var icon = document.getElementById("input-view-mode-icon");
      this.viewMode = !this.viewMode;

      if (this.viewMode) {
        icon.setAttribute("src", "assets/icons/box.svg");
      } else {
        icon.setAttribute("src", "assets/icons/eye.svg");
      }

      this.draw();
    }
  }, {
    key: "setSelectedBlock",
    value: function setSelectedBlock(blockId) {
      if (this.selectedBlock.id != 0) {
        document.getElementById("block-" + this.selectedBlock.id).classList.remove("selected");
      }

      this.selectedBlock = this.blockManager.getBlock(blockId);
      document.getElementById("block-" + this.selectedBlock.id).classList.add("selected");
    }
  }, {
    key: "setZoom",
    value: function setZoom(z) {
      this.zoom = document.getElementById("input-zoom").value = z;
      this.update();
    }
  }, {
    key: "export",
    value: function _export() {
      var tmpViewMode = this.viewMode;
      this.viewMode = true;
      var tmpZoom = this.zoom;
      this.setZoom(1);
      this.draw();
      var link = document.createElement('a');
      link.download = 'export-' + getDateTime() + '.png';
      link.href = this.canvas.toDataURL('image/png');
      link.click();
      this.viewMode = tmpViewMode;
      this.setZoom(tmpZoom);
      this.update();
      this.draw();
    }
  }, {
    key: "saveJson",
    value: function saveJson() {
      var formatBlocks = [];

      for (var i = 0; i < this.dZ; i++) {
        var formatBlocksY = [];

        for (var j = 0; j < this.dY; j++) {
          var formatBlocksX = [];

          for (var k = 0; k < this.dX; k++) {
            if (this.blocks[i][j][k] != undefined) {
              formatBlocksX.push(this.blocks[i][j][k].id);
            } else {
              formatBlocksX.push(0);
            }
          }

          formatBlocksY.push(formatBlocksX);
        }

        formatBlocks.push(formatBlocksY);
      }

      console.log(formatBlocks);
      var data = {
        "dX": this.dX,
        "dY": this.dY,
        "dZ": this.dZ,
        "blocks": formatBlocks
      };
      var link = document.createElement('a');
      link.download = 'project-' + getDateTime() + '.json';
      link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
      link.click();
    }
  }, {
    key: "loadJson",
    value: function loadJson(file) {
      var _this2 = this;

      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = function (readerEvent) {
        var content = readerEvent.target.result;
        var data = JSON.parse(content);
        _this2.dX = data.dX;
        _this2.dY = data.dY;
        _this2.dZ = data.dZ;
        _this2.blocks = [];

        for (var i = 0; i < _this2.dZ; i++) {
          var blocksY = [];

          for (var j = 0; j < _this2.dY; j++) {
            var blocksX = [];

            for (var k = 0; k < _this2.dX; k++) {
              blocksX.push(_this2.blockManager.getBlock(data.blocks[i][j][k]));
            }

            blocksY.push(blocksX);
          }

          _this2.blocks.push(blocksY);
        }

        _this2.viewMode = false;

        _this2.switchViewMode();

        _this2.activeLayer = 0;

        _this2.setZoom(1);

        _this2.draw();
      };
    }
  }, {
    key: "setPencilMode",
    value: function setPencilMode(mode) {
      this.rectangleFirstTile = null;
      this.rectangleLastTile = null;
      document.getElementById("tool-" + this.pencilMode).classList.remove("selected");
      this.pencilMode = mode;
      document.getElementById("tool-" + this.pencilMode).classList.add("selected");
    }
  }]);

  return Builder;
}();