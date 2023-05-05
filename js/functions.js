function getDistance(x1, y1, x2, y2) {
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function createImage(path) {
    let img = new Image();
    img.src = path;
    return img;
}

function getDateTime() {
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + "-" + current.getMinutes() + "-" + current.getSeconds();
    let dateTime = cDate + '-' + cTime;
    return dateTime
}