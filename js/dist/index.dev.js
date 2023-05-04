"use strict";

// Path : js\index.js
window.onload = function () {
  builder = new Builder(10, 10, 5);
};

window.onresize = function () {
  builder.update();
};