
var Staff = require('./staff');

const noteDefs = [
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// our basic melody is a collection of notes which may potentially be rendered across multiple staves
class Melody {
    constructor(opts) {
        opts = opts || {};

        this.notes = [];
        this.activeNote = 0;
        this.playStart = Date.now();
        this.currentBeat = opts.initialBeatOffset || 0;

        this.beatDuration = opts.beatDuration || 1000; // quarter note, not traditional numbering
        this.signatureCount = opts.beatsPerMeasure || 4;

        this.staff = new Staff({
            x: 25,
            y: 150,
            length: 750,
            lineGap: 20,
            beatDist: 50
        });
    }

    draw(ctx) {
        var timeElapsed = Date.now() - this.playStart;
        var beatsPassed = timeElapsed / this.beatDuration;

        this.staff.drawLines(ctx);
        this.drawNotes(ctx);
        this.staff.drawSweepLine(ctx, beatsPassed);
    }

    drawNotes(ctx) {
        var activeIndex = this.activeNote;
        this.notes.map(function(note, i) {
            var color = activeIndex == i ? "rgb(255,165,0)" : undefined;
            this.staff.drawNote(ctx, note, color );
        }.bind(this));
    }

    // numerical indices, octave 0 note 0 is middle c, note 0 is always c, note 1 is d and so on
    addNote(octave, note, durationInBeats) {
        var noteOffset = (octave * 7 + note) % 7;
        this.notes.push({
            startBeat: this.currentBeat,
            duration: durationInBeats,
            octave: octave,
            value: note,
            letter: noteDefs[noteOffset]
        });

        this.currentBeat += durationInBeats;
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

    processNote(pressedKey) {
        var note = this.notes[this.activeNote];

        if (note.letter == pressedKey) {
            this.activeNote++;
            
            // TODO: play note
        } else {
            // error tone if a letter key?
        }
    }

    restart() {
        this.activeNote = 0;
        this.notes = [];
        this.currentBeat = 0;
    }
}

module.exports = Melody;
