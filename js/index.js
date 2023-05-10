// Path : js\index.js

window.onload = () => {
    builder = new Builder(10, 10, 10);
}

window.onkeypress = function (e) {
    e = e || window.event;
    if (e.key == "m" || e.key == "M") {
        builder.switchViewMode();
    }
};

window.onresize = () => {
    builder.update();
}