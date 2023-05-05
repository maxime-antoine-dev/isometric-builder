// Path : js\index.js

window.onload = () => {
    builder = new Builder(10, 10, 10);
}

window.onresize = () => {
    builder.update();
}