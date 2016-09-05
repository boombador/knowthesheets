
const TAIL_HEIGHT = 60;
const noteDefs = [
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B'
];

function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// x coordinate of leftmost end of staff
// y is the vertical position of middle c line
class Staff {
    constructor(opts) {
        opts = opts || {};
        this.x = opts.x;
        this.y = opts.y;
        this.length = opts.length;
        this.lineGap = opts.lineGap;
        this.stepHeight = opts.lineGap / 2;
        this.beatDist = opts.beatDist;
        this.beatDuration = opts.beatDuration || 1000;

        this.currentX = opts.x;
        this.notes = [];
        this.activeNote = 0;
        this.lineStart = Date.now();
    }

    drawSweepLine(ctx) {
        var verticalOffset = 5 * this.lineGap;
        var timeElapsed = Date.now() - this.lineStart;
        var beatsPassed = timeElapsed / this.beatDuration;
        var dx = this.x + (timeElapsed * this.beatDist / this.beatDuration);

        ctx.save();
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        line(ctx, dx, this.y - verticalOffset, dx, this.y + verticalOffset);
        ctx.restore();
    }

    drawNotes(ctx) {
        var noteRadius = this.stepHeight;
        var activeIndex = this.activeNote;
        this.notes.map(function(note, i) {
            if (activeIndex == i) {
                ctx.save();
                ctx.fillStyle = "rgb(255,165,0)";
                ctx.strokeStyle = "rgb(255,165,0)";
            }

            this.drawNote(ctx,  note.x, note.y, note.duration, noteRadius );

            if (activeIndex == i) {
                ctx.restore();
            }
        }.bind(this));
    }

    // scaled so that duration 1 -> quarter note, 2 -> half note, etc.
    drawNote(ctx, x, y, duration, noteRadius) {
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


    render(ctx) {
        // treble staff
        var y = this.y - this.lineGap;
        for (var i = 0; i < 5; i++) {
            line(ctx, this.x, y, this.x + this.length, y);
            y -= this.lineGap;
        }

        // bass staff
        y = this.y + this.lineGap;
        for (i = 0; i < 5; i++) {
            line(ctx, this.x, y, this.x + this.length, y);
            y += this.lineGap;
        }

        this.drawSweepLine(ctx);
        this.drawNotes(ctx);
    }

    // numerical indices, octave 0 note 0 is middle c, note 0 is always c, note 1 is d and so on
    addNote(octave, note, duration) {
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
    }

    processNote(pressedKey) {
        var note = this.notes[this.activeNote];

        if (note.letter == pressedKey) {
            this.activeNote++;
            
            // TODO: play note
        } else {
            // error tone if a letter key?
        }
    }

    clear() {
        this.activeNote = 0;
        this.notes = [];
        this.currentX = this.x;
    }

    addOctaveScale(octave) {
        this.addNote(octave, 0, 1);
        this.addNote(octave, 1, 1);
        this.addNote(octave, 2, 1);
        this.addNote(octave, 3, 1);
        this.addNote(octave, 4, 1);
        this.addNote(octave, 5, 1);
        this.addNote(octave, 6, 1);
        this.addNote(octave, 7, 1);
    }

    randomQuarterNotes(noteCount) {
        for (var i = 0; i < noteCount; i++) {
            var octave = getRandomInt(1, 3);
            var note = getRandomInt(0, 7);
            this.addNote(octave, note, 1);
        }
    }
}

//export default Staff;
module.exports = Staff;
