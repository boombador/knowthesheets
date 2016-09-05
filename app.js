
var Melody = require('./src/melody');

var c;
var ctx;
var melody;

var WIDTH = 800, HEIGHT = 300;

function init() {
    c = document.getElementById("mainCanvas");
    c.width = WIDTH;
    c.height = HEIGHT;
    ctx = c.getContext("2d");

    melody = new Melody({
        x: 25,
        y: 150,
        length: 750,
        lineGap: 20,
        beatDist: 50,
        bpm: 180
    });

    melody.addOctaveScale(2);
    melody.addOctaveScale(1);

    document.body.onkeydown = handleKeypress;

    document.getElementById('newExercise').addEventListener('click', randomExercise);

    loop();
}

function randomExercise() {
    melody.restart();
    melody.randomQuarterNotes(16);
}

function handleKeypress(evt) {
    if (evt.which < 65 || evt.which > 65+6) {
        return;
    }

    var pressResult = document.getElementById('userPress');
    var pressedKey = String.fromCharCode(evt.which);
    pressResult.innerHTML = pressedKey;
    melody.processNote(pressedKey);
}

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect( 0, 0, WIDTH, HEIGHT );
    melody.update();
    melody.render(ctx);
}

init();

