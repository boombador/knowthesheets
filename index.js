
var c;
var ctx;

var WIDTH = 800, HEIGHT = 300;
var TAIL_HEIGHT = 60;

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

    y = staffY + this.lineGap;
    for (i = 0; i < 5; i++) {
        line(staffX, y, staffX + this.length, y);
        y += this.lineGap;
    }
    var noteRadius = this.stepHeight;
    this.notes.map(function(note, i) {
        drawNote( note.x, note.y, note.duration, noteRadius );
    });
};

// numerical indices, octave 0 note 0 is middle c, note 0 is always c, note 1 is d and so on
Staff.prototype.addNote = function(octave, note, duration) {
    var offset = (octave * 7 * this.stepHeight) + note * this.stepHeight;
    this.notes.push({
        x: this.currentX,
        y: this.y - offset,
        duration: duration
    });

    this.currentX += this.beatDist * duration;
};

init();
var staff = new Staff(25, 150, 750, 20, 50);

staff.addNote(0, 0, 1); // C
staff.addNote(0, 1, 1); // D
staff.addNote(0, 2, 1); // E
staff.addNote(0, 3, 1); // F
staff.addNote(0, 4, 1); // G
staff.addNote(0, 5, 1); // A
staff.addNote(0, 6, 1); // B

staff.addNote(-1, 7, 1);
staff.addNote(-1, 6, 1);
staff.addNote(-1, 5, 1);
staff.addNote(-1, 4, 1);
staff.addNote(-1, 3, 1);
staff.addNote(-1, 2, 1);
staff.addNote(-1, 1, 1);

staff.render();
