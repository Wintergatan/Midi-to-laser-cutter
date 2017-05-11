var noteLetters = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]
var notes = [];

for (var num = 0; num < 128; num++) {
    notes.push({letter: noteLetters[num%12], octave: Math.floor(num/12)});
}

var scaleModes = {
    major: {
        ionian:  	[2,2,1,2,2,2],
        dorian: 	[2,1,2,2,2,1],
        phyrigian:  [1,2,2,2,1,2],
        lydian:     [2,2,2,1,2,2],
        mixolydian: [2,2,1,2,2,1],
        aeolian:    [2,1,2,2,1,2],
        locrian:    [1,2,2,1,2,2]
    },
    harmonic_minor: {
        harmminor: 		[2,1,2,2,1,3],
        locriansharpsix:[1,2,2,1,3,1],
        ionianaug:     	[2,2,1,3,1,2],
        romanian: 		[2,1,3,1,2,1],
        phrygiandom:   	[1,3,1,2,1,2],
        lydiansharptwo: [3,1,2,1,2,2],
        ultralocrian:   [1,2,1,2,2,1]
    },
    melodic_minor: {
        jazz_minor: 		[2,1,2,2,2,2],
        dorianflatnine: 	[1,2,2,2,2,1],
        lydianaug: 			[2,2,2,2,1,2],
        lydiandom: 			[2,2,2,1,2,1],
        mixolydianflatsix: 	[2,2,1,2,1,2],
        semilocrian: 		[2,1,2,1,2,2],
        superlocrian: 		[1,2,1,2,2,2]
    }
};

function generateScale(root, scale, mode) {
    var result = [];
    var gaps = scaleModes[scale][mode];
    if (gaps === undefined) return undefined;
    result.push(root);
    var lastNoteNum = noteLetters.indexOf(root);
    for (var i=0; i<gaps.length; i++) {
        lastNoteNum += gaps[i];
        result.push(noteLetters[lastNoteNum%12]);
    }

    return result;
}