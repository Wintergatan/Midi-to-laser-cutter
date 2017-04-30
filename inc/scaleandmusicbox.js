var noteLetters = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]
var notes = [];

for (var num = 0; num < 128; num++) {
	notes.push({letter: noteLetters[num%12], octave: Math.floor(num/12)});
}

var makerjs = require('makerjs');

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
}

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

function generateMusicBox (startingNote, scale, size) {
	var result = [];
	result.push(startingNote);

	for (var i=1; i<size; i++) {
		var lastNote = result[i-1];
		var lastNoteNum = noteLetters.indexOf(lastNote.letter);
		var noteNum = lastNoteNum;
		var lastOctave = lastNote.octave;

		do { //find next note that belongs to the scale
			noteNum += 1;
			noteNum %= 12;
		} while(scale.find(function(note){return note==noteLetters[noteNum]}) == undefined);

		result.push({letter: noteLetters[noteNum], octave: (noteNum < lastNoteNum) ? (lastOctave + 1) : lastOctave}); //if noteNum < lastNoteNum, that means we are in a new octave
	}
	return result;
}

function stringifyScale (scale) {
	var noteAlternativesSharpToFlat = {
		"c#": "db", 
		"d#": "eb", 
		"e#": "f", 
		"f#": "gb", 
		"g#": "ab", 
		"a#": "bb", 
		"b#": "c"
	};

	var noteGaps = [];
	for (var i=1; i<scale.length; i++) {
		noteGaps.push(noteLetters.indexOf(scale[i])-noteLetters.indexOf(scale[i-1]));
	}
	var arr = [];
	arr.push(scale[0]);
	for (var i=1; i<scale.length; i++) {
		if (!scale[i-1].includes("#") && noteGaps[i-1] == 1 && scale[i-1] != "e" && scale[i-1] != "b") {
			arr.push(noteAlternativesSharpToFlat[scale[i]]);
		}
		else if (arr[i-1].includes("b") && noteGaps[i-1] == 2 && arr[i-1] != "eb" && scale[i-1] != "bb") {
			arr.push(noteAlternativesSharpToFlat[scale[i]]);
		}
		else {arr.push(scale[i]);}
	}
	for (var i=0; i<arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}

	return arr.join(" ");
}
