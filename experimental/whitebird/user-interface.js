$(document).ready(function () {
    // No magic numbers
    var MIDI_MIN_NOTE_NUMBER = 0;
    var MIDI_MAX_NOTE_NUMBER = 127;
    var MIDI_NUMBER_OF_NOTES = 12;

    // Enums, settings, variables and help functions used throughout the document
    var unitEnum = {
        "millimeters": "mm",
        "inches": "in"
    };
    var settings = {
        board: [{ name: "A7", midi: 93 }, { name: "G7", midi: 91 }, { name: "F7", midi: 89 }, { name: "E7", midi: 88 }, { name: "D7", midi: 86 }, { name: "C7", midi: 84 }, { name: "B6", midi: 83 }, { name: "A6", midi: 81 }, { name: "G6", midi: 79 }, { name: "F6", midi: 77 }, { name: "E6", midi: 76 }, { name: "D6", midi: 74 }, { name: "C6", midi: 72 }, { name: "B5", midi: 71 }, { name: "A5", midi: 69 }, { name: "G5", midi: 67 }, { name: "F5", midi: 65 }, { name: "E5", midi: 64 }, { name: "D5", midi: 62 }, { name: "C5", midi: 60 }],
        workpiece: {
            width: 600,
            height: 300
        },
        note: {
            width: 8,
            height: 3,
            rounding: 2
        },
        unit: unitEnum.millimeters,
        volume: -6,
        bpm: 120,
        strokeWidth: 1,
        startOffset: 10,
        endOffset: 10,
        edgeDifference: 10
    };

    var song;
    var goodNotes;

    function addUnit(distance) {
        return distance + settings.unit;
    }

    /*
     * Load Midi file and select track
     */

    $("#file-picker-midi").change(function () {
        var fileName = $(this).val();
        $("#midi-file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
        var file = $('#file-picker-midi')[0].files[0];
        loadMidiFile(file);
        //$("#download-btn").prop('disabled', false)
    });

    // TO REMOVE
    MidiConvert.load("a.mid", function (midi) {
        song = midi;
        song.selectedTrack = 1;
        refreshPreview();
    })
    // END TO REMOVE
    function loadMidiFile(file) {
        console.log('Uploading file detected in INPUT ELEMENT, processing data..');
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                song = MidiConvert.parse(e.target.result);
            } catch (e) {
                alert("Error loading midi file.")
                return;
            }
            var tracks = song.tracks.map(function (a) {
                if (a.name)
                    return a.name;
                else
                    return "unnamed";
            });

            var trackPicker = $('#trackPicker');
            trackPicker.empty();
            for (var i = 0; i < tracks.length; i++) {
                trackPicker.append($("<option/>", {
                    value: i,
                    text: tracks[i]
                }));
            }
            trackPicker.selectpicker('refresh');
            $('#trackModal').modal('show');
        };
        reader.readAsBinaryString(file);
    }

    $('#selectTrackForm').submit(function (e) {
        e.preventDefault();
        $('#trackModal').modal('hide');
        song.selectedTrack = $('#trackPicker option:selected').val();
        refreshPreview();
    });

    // Based on the table at http://www.electronics.dit.ie/staff/tscarff/Music_technology/midi/midi_note_numbers_for_octaves.htm
    function noteNumberToNote(noteNumber) {
        if (noteNumber < MIDI_MIN_NOTE_NUMBER || noteNumber > MIDI_MAX_NOTE_NUMBER)
            throw "Not a valid note number";

        var scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        note = scaleIndexToNote[noteNumber % MIDI_NUMBER_OF_NOTES];
        note += parseInt(noteNumber / MIDI_NUMBER_OF_NOTES).toString();
        return note;
    }

    /*
     * Notes select
     */
     // Can be replaced by HTML, less taxing on javascript
    fillNoteSelect();
    function fillNoteSelect() {
        var noteNames = [];
        for (var i = MIDI_MIN_NOTE_NUMBER; i <= MIDI_MAX_NOTE_NUMBER; i++) {
            noteNames.push(noteNumberToNote(i));
        }
        var options = "";
        $.each(noteNames, function (noteKey, noteName) {
            options += '<option value="' + noteKey + '">' + noteName + '</option>';
        });

        $(".note").each(function (i) {
            $(this).append(options);
            $(this).val(settings.board[i].midi);
        });
    }

    /*
     * Showing preview
     */

    var snap = Snap("#preview");
    snap.zpd();
    var canvas = Snap.select('#snapsvg-zpd-' + snap.id);

    $("#show-preview").click(function () {
        refreshPreview();
    });

    function refreshPreview() {
        var notes = song.tracks[song.selectedTrack].notes;

        canvas.clear();
        //snap.clear();

        canvas.rect(0, 0, addUnit(settings.workpiece.width), addUnit(settings.workpiece.height)).attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });

        var lowestNote = MIDI_MAX_NOTE_NUMBER;
        var highestNote = MIDI_MIN_NOTE_NUMBER;

        $.each(notes, function (i, note) {
            if (note.midi < lowestNote)
                lowestNote = note.midi;
            if (note.midi > highestNote)
                highestNote = note.midi;
        });

        var notesGroup = canvas.g();
        notesGroup.attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });

        var badNotesGroup = canvas.g();
        badNotesGroup.attr({
            fill: "none",
            stroke: "#FF0000",
            strokeWidth: settings.strokeWidth
        });

        var cardGroup = canvas.g().attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });

        var startX = 5;
        var endX = startX + settings.edgeDifference + settings.startOffset + (notes[notes.length - 1].time * 20) + settings.note.width + settings.endOffset;
        var startY = 5;
        var endY = startY + 69.7;


        var lineHeight = 3;
        var topMargin = 6.35;
        var fontSize = 3;

        cardGroup.add(canvas.line(
            addUnit(startX + settings.edgeDifference),
            addUnit(startY),
            addUnit(endX + settings.endOffset),
            addUnit(startY)
        ));
        cardGroup.add(canvas.line(
            addUnit(endX + settings.endOffset),
            addUnit(startY),
            addUnit(endX - settings.edgeDifference + settings.endOffset),
            addUnit(endY)));
        cardGroup.add(canvas.line(addUnit(endX - settings.edgeDifference + settings.endOffset),
            addUnit(endY),
            addUnit(startX),
            addUnit(endY)
        ));
        cardGroup.add(canvas.line(addUnit(startX),
            addUnit(endY),
            addUnit(startX + settings.edgeDifference),
            addUnit(startY)
        ));

        var noteNamesGroup = canvas.g().attr({
            'font-size': addUnit(fontSize),
            'text-anchor': "end"
        });

        var gridLinesGroup = canvas.g().attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });

        // Note lines
        for (var i = 0; i < settings.board.length; i++) {
            var x = startX + settings.edgeDifference + settings.startOffset;
            var y = startY + topMargin + (i * lineHeight);
            gridLinesGroup.line(addUnit(x), addUnit(y), addUnit(endX - settings.edgeDifference), addUnit(y));
            noteNamesGroup.text(addUnit(x - 1), addUnit(y + (fontSize / 3)), settings.board[i].name);
        }

        // Vertical lines
        var verticalLineY1 = startY + topMargin;
        var verticalLineY2 = verticalLineY1 + ((settings.board.length - 1) * lineHeight);
        var verticalLineX = startX + settings.edgeDifference + settings.startOffset;
        while (verticalLineX < endX - settings.edgeDifference) {
            gridLinesGroup.line(addUnit(verticalLineX), addUnit(verticalLineY1), addUnit(verticalLineX), addUnit(verticalLineY2));
            verticalLineX += (10);
        }

        goodNotes = [];
        var amountOfBadNotes = 0;
        $.each(notes, function (i, note) {
            var x = startX + settings.edgeDifference + settings.startOffset + note.time * 20;
            var y;

            var boardIndex = -1;
            for (var i = 0; i < settings.board.length; i++) {
                if (settings.board[i].midi === note.midi) {
                    boardIndex = i;
                    break;
                }
            }
            if (boardIndex != -1) {
                goodNotes.push(note);
                y = startY + topMargin + (boardIndex * lineHeight);
                //notesGroup.add(canvas.circle(addUnit(x), addUnit(y), addUnit(noteHeight / 2)));
                notesGroup.add(canvas.rect(
                    addUnit(x),
                    addUnit(y - (settings.note.height / 2)),
                    addUnit(settings.note.width),
                    addUnit(settings.note.height),
                    addUnit(settings.note.rounding)
                ));
            } else {
                amountOfBadNotes++;
                badNotesGroup.add(canvas.rect(
                    addUnit(x),
                    addUnit(startY),
                    addUnit(settings.note.width),
                    addUnit(settings.note.height),
                    addUnit(settings.note.rounding)
                ));
            }
        });
        console.log("There are " + amountOfBadNotes + " bad notes")
    }

    /*
     * Playback of the notes
     */
    var playBackLine;
    $("#play").click(function () {
        refreshPreview();
        playBackLine = canvas.line(addUnit(settings.startOffset), "2mm", addUnit(settings.startOffset), "80mm").attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });
        Tone.Transport.stop();

        var synth = new Tone.PolySynth(settings.board.length, Tone.Synth, {
            "oscillator": {
                "type": "square",
                "count": 3,
                "spread": 30
            }
        }).toMaster();
        // Not working yet
        var vol = new Tone.Volume(settings.volume);
        synth.chain(vol, Tone.Master);
        Tone.Transport.bpm.value = settings.bpm;
        new Tone.Part(function (time, note) {
            synth.triggerAttackRelease(note.name, .1, time, 1);

        }, goodNotes).start()

        Tone.Transport.start();
        playBackLine.animate({ x1: "100mm", x2: "100mm" }, 5000);
    });

    $("#stop").click(function () {
        Tone.Transport.stop()
        playBackLine.stop();
        playBackLine.remove();
        //playBackLine.attr({ x1: "2mm", x2: "2mm" });
    });

    /*
     * Exporting options
     */

    $("#line-color").change(function () {
        var lineColor = $(this).val().toUpperCase();
        $("#color-suffix").text(lineColor);
    });
});