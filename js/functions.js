function getDistance(x1, y1, x2, y2) {
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function createImage(path) {
    let img = new Image();
    img.src = path;
    return img;
}