"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Path : js\classes\Block.js
var Block =
/*#__PURE__*/
function () {
  function Block() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var texture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "empty-block.png";

    _classCallCheck(this, Block);

    this.id = id;
    this.texture = texture;
    this.image = createImage("./assets/textures/blocks/" + this.texture);
  }

  _createClass(Block, [{
    key: "displayData",
    value: function displayData() {
      console.log("Id: " + this.id);
      console.log("Texture: " + this.texture);
      console.log(this.image);
    }
  }]);

  return Block;
}();