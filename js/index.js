// Path : js\index.js

window.onload = () => {
    builder = new Builder(10, 10, 5);
}

window.onresize = () => {
    builder.update();
}