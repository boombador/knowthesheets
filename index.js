
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

// scaled so that duration 1 -> quarter note, 2 -> half note, etc.
function drawNote(x, y, duration) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.3, 1);

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI*2); 
    ctx.closePath();

    if (duration == 1) {
        ctx.fill();
        ctx.moveTo(6, 0);
        ctx.lineTo(6, -30);
        ctx.stroke();
    } else if (duration == 2) {
        ctx.stroke();
        ctx.moveTo(6, 0);
        ctx.lineTo(6, -30);
        ctx.stroke();
    } else if (duration == 4) {
        ctx.stroke();
    }

    ctx.restore();
}

init();
drawStaff(25, 25, 750);
drawStaff(25, 150, 750);
drawNote(25, 25, 4);
