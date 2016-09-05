
const TAIL_HEIGHT = 60;
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var statusColors = {
    "correct": "rgb(0, 255, 0)",
    "missed": "rgb(255, 0, 0)",
    "unvisited": "rgb(0, 0, 0)",
    "active": "rgb(255,165,0)"
};

// x coordinate of leftmost end of staff
// y is the vertical position of middle c line
class Staff {
    constructor(opts) {
        opts = opts || {};
        this.x = opts.x;
        this.y = opts.y;
        this.length = opts.length;
        this.lineGap = opts.lineGap;
        this.beatDist = opts.beatDist;
    }

    // should be fractional amount
    drawSweepLine(ctx, beatsPassed) {
        var dx = this.x + beatsPassed * this.beatDist;
        var verticalOffset = 5 * this.lineGap;

        ctx.save();
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        line(ctx, dx, this.y - verticalOffset, dx, this.y + verticalOffset);
        ctx.restore();
    }

    // scaled so that duration 1 -> quarter note, 2 -> half note, etc.
    drawNote(ctx, note, color) {
        var stepHeight = this.lineGap / 2;
        var noteRadius = stepHeight || 6;

        var noteX = this.beatDist * note.startBeat + this.x;

        var bottom = this.y + 14*stepHeight;
        var offsetHeight = (note.octave * 7 * stepHeight) + (note.value * stepHeight);
        var noteY = bottom - offsetHeight;

        ctx.save();
        ctx.fillStyle = statusColors[note.status];
        ctx.strokeStyle = statusColors[note.status];

        ctx.translate(noteX, noteY);
        ctx.scale(1.3, 1);

        ctx.beginPath();
        ctx.arc(0, 0, noteRadius, 0, Math.PI*2); 
        ctx.closePath();

        if (note.duration == 1) {
            ctx.fill();
            ctx.moveTo(noteRadius, 0);
            ctx.lineTo(noteRadius, -TAIL_HEIGHT);
            ctx.stroke();
        } else if (note.duration == 2) {
            ctx.stroke();
            ctx.moveTo(noteRadius, 0);
            ctx.lineTo(noteRadius, -TAIL_HEIGHT);
            ctx.stroke();
        } else if (note.duration == 4) {
            ctx.stroke();
        }

        ctx.restore();
    }

    drawLines(ctx) {
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

    }
}

module.exports = Staff;
