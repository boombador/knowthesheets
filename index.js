
var c;
var ctx;

var WIDTH = 800, HEIGHT = 300;

function init() {
    c = document.getElementById("mainCanvas");
    c.width = WIDTH;
    c.height = HEIGHT;
    ctx = c.getContext("2d");
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var lineGapHeight = 20;

function drawStaff(x, y, length) {
    for (var i = 0; i < 5; i++) {
        line(x, y, x + length, y);
        y += lineGapHeight;
    }
}

init();
drawStaff(25, 25, 750);
drawStaff(25, 150, 750);
