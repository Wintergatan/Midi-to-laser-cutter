function processData(midiData) {
	console.log(midiData);

	var musicBox = generateMusicBox({letter: "c", octave: 5}, generateScale("c", "major", "ionian"), 20);

	var events = [];

	for(var i=0; i<midiData.tracks; i++){
		var currentTick = 0;
		for(var j=0; j<midiData.track[i].event.length; j++) {
			var event = midiData.track[i].event[j];
			currentTick+=event.deltaTime;
			if (event.type == 9){ //note on events
				var note = notes[event.data[0]];
				var index = musicBox.indexOf(musicBox.find(function(x){return x.letter == note.letter && x.octave == note.octave;}));

				if (index != -1) {
					events.push({type: "noteon", tick: currentTick, pitch: index, note: notes[event.data[0]], channel: event.channel, track: i});
				}
			}	
			else if (event.type == 255) { //meta events
				if(event.metaType == 81) { //tempo change events
					events.push({type: "tempochange", tempo: event.data, tick: currentTick});
				}
			}
		}
	}
	events.sort(function (a,b) {return compare(a.pitch,b.pitch)});

	var notesAgainstTime = [];

	var timeAtLastTempoChange = 0;
	var ticksAtLastTempoChange = 0;
	var tempo = 500000;
	var ppq = midiData.timeDivision;

	for (var i=0; i<events.length; i++) {
		var event = events[i];

		if (event.type == "tempochange") {
			timeAtLastTempoChange += tempo * (event.tick - ticksAtLastTempoChange) / ppq;
			tempo = event.tempo;
			ticksAtLastTempoChange = event.tick;
			console.log("Tempo changed to " + tempo + " at " + timeAtLastTempoChange);
		}
		if (event.type == "noteon") {
			var rtime = timeAtLastTempoChange + tempo * (event.tick - ticksAtLastTempoChange) / ppq;
			notesAgainstTime.push({time: rtime, pitch: event.pitch, x: 0, y: 0});
		}
	}
	
	var shortestDeltaTBetweenNotes = Number.MAX_SAFE_INTEGER;

	
	notesAgainstTime.sort(function(a,b) {
		return compare(a.time, b.time);
	});

	for (var i=0; i<musicBox.length; i++) {
		var notesInThisPitch = [];
		for (var j=0; j<notesAgainstTime.length; j++) {
			var note = notesAgainstTime[j];
			if (note.pitch == i) {notesInThisPitch.push(note)}
		}
		for (var j=0; j<notesInThisPitch.length-1; j++) {
			var deltaT = notesInThisPitch[j+1].time - notesInThisPitch[j].time;
			if (deltaT < shortestDeltaTBetweenNotes) shortestDeltaTBetweenNotes = deltaT;
		}
	}

	var minimumDistanceBetweenNotes=8;
	var paperSpeed = minimumDistanceBetweenNotes/shortestDeltaTBetweenNotes;
	var yOffset = 3;

	console.log(shortestDeltaTBetweenNotes);

	
	for (var i=0; i<notesAgainstTime.length; i++) {
		var note = notesAgainstTime[i];
		note.x = note.time*paperSpeed;
		note.y = note.pitch*yOffset;
	}
	
	return notesAgainstTime;
}
