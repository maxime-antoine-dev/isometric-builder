"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Path : js\classes\BlockManager.js
var BlockManager =
/*#__PURE__*/
function () {
  function BlockManager() {
    _classCallCheck(this, BlockManager);

    this.blocks = [];
    var blocksTmp = $.retriveBlocks();

    for (var i = 0; i < blocksTmp.length; i++) {
      this.blocks[blocksTmp[i].id] = new Block(blocksTmp[i].id, blocksTmp[i].texture, blocksTmp[i].width, blocksTmp[i].height);
    }
  }

  _createClass(BlockManager, [{
    key: "getBlock",
    value: function getBlock(id) {
      if (id == 0 || this.blocks[id] == null || this.blocks[id] == undefined) {
        return null;
      } else {
        return this.blocks[id];
      }
    }
  }]);

  return BlockManager;
}();