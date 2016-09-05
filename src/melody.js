
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

    // bpm - tempo
    // count - beats per measure
    // note - single beat note value
    constructor(opts) {
        opts = opts || {};

        this.notes = [];
        this.playStart = Date.now();

        this.activeNoteIndex = 0;
        this.currentBeat = 0; // function of elapsed time and beatDuration

        this.beatDuration = (60000 / opts.bpm) || 1000; // convert bpm to milliseconds per beat

        this.staff = new Staff({
            x: 25,
            y: 150,
            length: 750,
            lineGap: 20,
            beatDist: 50,
            signatureCount: 4,
            signatureNoteValue: 4
        });
    }

    update() {
        var timeElapsed = Date.now() - this.playStart;
        this.currentBeat = timeElapsed / this.beatDuration;

        var activeNote = this.notes[this.activeNoteIndex];
        if (this.activeNoteIndex >= this.notes.length) {
            return;
        }

        switch (activeNote.status) {
            case "correct":
                // this should happen asynchronously
                this.activeNoteIndex++;
                break;

            case "unvisited":
                // the active note has just been advanced, could be before or after current beat position
                var delta = Math.abs(this.currentBeat - activeNote.startBeat);
                if (delta < 0.5) {
                    activeNote.status = "active"
                }
                break;

            case "active":
                // waiting for user input, if currentBeat goes too far the note start the note should be marked missed
                var delta = this.currentBeat - activeNote.startBeat;
                if (delta > 0.5) {
                    activeNote.status = "missed"
                    this.activeNoteIndex++;
                }
                break;

            case "missed":
                console.warn("Missed note should never be active");
                break;

            default:
                console.warn("implement note status");
        }

    }

    render(ctx) {
        this.staff.drawMeasures(ctx);

        this.notes.map(function(note, i) {
            this.staff.drawNote( ctx, note );
        }.bind(this));

        this.staff.drawSweepLine(ctx, this.currentBeat);
    }

    // numerical indices, octave 0 note 0 is middle c, note 0 is always c, note 1 is d and so on
    addNote(octave, note, durationInBeats) {
        var noteOffset = (octave * 7 + note) % 7;
        this.notes.push({
            startBeat: this.currentBeat,
            duration: durationInBeats,
            octave: octave,
            value: note,
            status: 'unvisited',
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
        if (this.activeNoteIndex >= this.notes.length) {
            return;
        }

        var note = this.notes[this.activeNoteIndex];

        if (note.letter == pressedKey) {
            note.status = "correct";
            this.activeNoteIndex++;
            
            // TODO: play note
        } else {
            // error tone if a letter key?
        }
    }

    restart() {
        this.activeNoteIndex = 0;
        this.notes = [];
        this.currentBeat = 0;
        this.playStart = Date.now();
    }
}

module.exports = Melody;
