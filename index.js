
var c;
var ctx;
var staff;

var WIDTH = 800, HEIGHT = 300;
var TAIL_HEIGHT = 60;

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
    var pressResult = document.getElementById('userPress');
    var pressedKey = String.fromCharCode(evt.which);

    if (evt.which < 65 || evt.which > 65+6) {
        return;
    }

    pressResult.innerHTML = pressedKey;
    staff.processNote(pressedKey);
}

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect( 0, 0, WIDTH, HEIGHT );
    staff.render();
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// scaled so that duration 1 -> quarter note, 2 -> half note, etc.
function drawNote(x, y, duration, noteRadius) {
    noteRadius = noteRadius || 6;
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(1.3, 1);

    ctx.beginPath();
    ctx.arc(0, 0, noteRadius, 0, Math.PI*2); 
    ctx.closePath();

    if (duration == 1) {
        ctx.fill();
        ctx.moveTo(noteRadius, 0);
        ctx.lineTo(noteRadius, -TAIL_HEIGHT);
        ctx.stroke();
    } else if (duration == 2) {
        ctx.stroke();
        ctx.moveTo(noteRadius, 0);
        ctx.lineTo(noteRadius, -TAIL_HEIGHT);
        ctx.stroke();
    } else if (duration == 4) {
        ctx.stroke();
    }

    ctx.restore();
}

// x coordinate of leftmost end of staff
// y is the vertical position of middle c line
function Staff(x, y, length, lineGap, beatDist) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.lineGap = lineGap;
    this.stepHeight = lineGap / 2;
    this.beatDist = beatDist;
    
    this.currentX = x;
    this.notes = [];
    this.activeNote = 0;
}

Staff.prototype.render = function() {
    var staffX = this.x;
    var staffY = this.y;

    // treble staff
    var y = staffY - this.lineGap;
    for (var i = 0; i < 5; i++) {
        line(staffX, y, staffX + this.length, y);
        y -= this.lineGap;
    }

    // bass staff
    y = staffY + this.lineGap;
    for (i = 0; i < 5; i++) {
        line(staffX, y, staffX + this.length, y);
        y += this.lineGap;
    }

    // draw notes
    var noteRadius = this.stepHeight;
    var activeIndex = this.activeNote;
    this.notes.map(function(note, i) {
        if (activeIndex == i) {
            ctx.save();
            ctx.fillStyle = "rgb(255,165,0)";
            ctx.strokeStyle = "rgb(255,165,0)";
        }

        drawNote( note.x, note.y, note.duration, noteRadius );

        if (activeIndex == i) {
            ctx.restore();
        }
    });
};

var noteDefs = [
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B'
];

// numerical indices, octave 0 note 0 is middle c, note 0 is always c, note 1 is d and so on
Staff.prototype.addNote = function(octave, note, duration) {
    var offsetHeight = (octave * 7 * this.stepHeight) + (note * this.stepHeight);
    var bottom = this.y + 14*this.stepHeight;

    var noteOffset = (octave * 7 + note) % 7;
    this.notes.push({
        x: this.currentX,
        y: bottom - offsetHeight,
        duration: duration,
        letter: noteDefs[noteOffset]
    });

    this.currentX += this.beatDist * duration;
};

Staff.prototype.processNote = function(pressedKey) {
    var note = this.notes[this.activeNote];

    if (note.letter == pressedKey) {
        this.activeNote++;
        
        // TODO: play note
    } else {
        // error tone if a letter key?
    }
};

Staff.prototype.clear = function() {
    this.notes = [];
    this.currentX = this.x;
};

Staff.prototype.addOctaveScale = function(octave) {
    this.addNote(octave, 0, 1);
    this.addNote(octave, 1, 1);
    this.addNote(octave, 2, 1);
    this.addNote(octave, 3, 1);
    this.addNote(octave, 4, 1);
    this.addNote(octave, 5, 1);
    this.addNote(octave, 6, 1);
    this.addNote(octave, 7, 1);
};

Staff.prototype.randomQuarterNotes = function(noteCount) {
    for (var i = 0; i < noteCount; i++) {
        var octave = getRandomInt(1, 3);
        var note = getRandomInt(0, 7);
        this.addNote(octave, note, 1);
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

init();

