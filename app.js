

var Staff = require('./src/staff');

var c;
var ctx;
var staff;

var WIDTH = 800, HEIGHT = 300;

function init() {
    c = document.getElementById("mainCanvas");
    c.width = WIDTH;
    c.height = HEIGHT;
    ctx = c.getContext("2d");

    staff = new Staff(25, 150, 750, 20, 50);

    staff.addOctaveScale(2);
    staff.addOctaveScale(1);

    document.body.onkeydown = handleKeypress;

    document.getElementById('newExercise').addEventListener('click', randomExercise);

    loop();
}

function randomExercise() {
    staff.clear();
    staff.randomQuarterNotes(16);
}

function handleKeypress(evt) {
    if (evt.which < 65 || evt.which > 65+6) {
        return;
    }

    var pressResult = document.getElementById('userPress');
    var pressedKey = String.fromCharCode(evt.which);
    pressResult.innerHTML = pressedKey;
    staff.processNote(pressedKey);
}

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect( 0, 0, WIDTH, HEIGHT );
    staff.render(ctx);
}

init();

