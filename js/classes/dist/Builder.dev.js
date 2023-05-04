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

    this.blockWidth = 64;
    this.blockHeight = 64;
    this.gridColor = "#43454d";
    this.gridActiveColor = "#36d3ff";
    this.dX = dX;
    this.dY = dY;
    this.dZ = dZ;
    this.viewMode = false;
    this.selectedBlock = new Block();
    this.blocks = this.makeGrid();
    document.getElementById("input-active-layer").setAttribute("max", this.dZ - 1);
    this.canvas = document.getElementById("canvas-builder");
    this.ctx = this.canvas.getContext("2d");
    this.update();
    this.canvas.addEventListener("mousemove", function (e) {
      if (!_this.viewMode) {
        var pos = _this.getMousePos(e);

        var tilePos = _this.getSelectedTile(pos['x'], pos['y']);

        _this.draw();

        _this.highlightTile(tilePos["x"], tilePos["y"], tilePos["z"]);

        _this.previewBlock(tilePos["x"], tilePos["y"], tilePos["z"]);
      }
    });
    this.canvas.addEventListener("mouseout", function (e) {
      if (!_this.viewMode) {
        _this.draw();
      }
    });
    this.canvas.addEventListener("mousedown", function (e) {
      if (!_this.viewMode) {
        var pos = _this.getMousePos(e);

        var tilePos = _this.getSelectedTile(pos['x'], pos['y']);

        _this.placeBlock(tilePos["x"], tilePos["y"], tilePos["z"]);

        _this.draw();
      }
    });
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
            this.ctx.drawImage(this.blocks[level][j][i].image, this.tilesPositions[level][j][i]["x"] - 0.5 * this.blockWidth * this.zoom, this.tilesPositions[level][j][i]["y"] - 0.75 * this.blockHeight * this.zoom, this.blockWidth * this.zoom, this.blockHeight * this.zoom);
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
    key: "previewBlock",
    value: function previewBlock(x, y, z) {
      var pos = this.tilesPositions[z][y][x];
      this.ctx.globalAlpha = 0.5;
      this.ctx.drawImage(this.selectedBlock.image, pos["x"] - 0.5 * this.blockWidth * this.zoom, pos["y"] - 0.75 * this.blockHeight * this.zoom, this.blockWidth * this.zoom, this.blockHeight * this.zoom);
      this.ctx.globalAlpha = 1;
    }
  }, {
    key: "placeBlock",
    value: function placeBlock(x, y, z) {
      if (this.selectedBlock.id != 0) {
        this.blocks[z][y][x] = this.selectedBlock;
      } else {
        this.blocks[z][y][x] = undefined;
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
    value: function setSelectedBlock(block) {
      document.getElementById("block-" + this.selectedBlock.id).classList.remove("selected");
      this.selectedBlock = block;
      document.getElementById("block-" + this.selectedBlock.id).classList.add("selected");
    }
  }]);

  return Builder;
}();