$(document).ready(function () {

    /*
     * Load Midi file and select track
     */
    var MIDI_MIN_NOTE_NUMBER = 0;
    var MIDI_MAX_NOTE_NUMBER = 127;
    var MIDI_NUMBER_OF_NOTES = 12;
    // To be replaced by a setting
    var WORKPIECE_WIDTH = "600mm";
    var WORKPIECE_HEIGHT = "300mm";
    var STROKE_WIDTH = 1;

    var BPM = 120;
    var AMOUNT_OF_PINS = 20;

    var VOLUME_VALUE = -6;

    var song;

    $("#file-picker-midi").change(function () {
        var fileName = $(this).val();
        $("#midi-file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
        var file = $('#file-picker-midi')[0].files[0];
        console.log(file);
        loadMidiFile(file);
        //$("#download-btn").prop('disabled', false)
    });

    // TO REMOVE
    loadMidiFile("");
    function loadMidiFile(file) {
        /*console.log('Uploading file detected in INPUT ELEMENT, processing data..');
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                song = MidiConvert.parse(e.target.result);
            } catch (e) {
                alert("Error loading midi file.")
                return;
            }
            //console.log(song);
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
            //var jsonResult = JSON.stringify(partsData, undefined, 2);
            //console.log(jsonResult);

        };
        reader.readAsBinaryString(file);*/

        MidiConvert.load("a.mid", function (midi) {
            console.log(midi)
            song = midi.tracks[1].notes;
            console.log(song);
            refreshPreview();
        })
    }

    $('#selectTrackForm').submit(function (e) {
        e.preventDefault();
        $('#trackModal').modal('hide');
        var i = $('#trackPicker option:selected').val();
        song = song.tracks[i].notes;
        //console.log(song)
    });

    // Based on the table at http://www.electronics.dit.ie/staff/tscarff/Music_technology/midi/midi_note_numbers_for_octaves.htm
    function noteNumberToNote(noteNumber) {
        if (noteNumber < MIDI_MIN_NOTE_NUMBER || noteNumber > MIDI_MAX_NOTE_NUMBER)
            throw "Not a valid note number";

        var note = parseInt(noteNumber / MIDI_NUMBER_OF_NOTES).toString();

        switch (noteNumber % MIDI_NUMBER_OF_NOTES) {
            case 0:
                note += "C";
                break;
            case 1:
                note += "C#";
                break;
            case 2:
                note += "D";
                break;
            case 3:
                note += "D#";
                break;
            case 4:
                note += "E";
                break;
            case 5:
                note += "F";
                break;
            case 6:
                note += "F#";
                break;
            case 7:
                note += "G";
                break;
            case 8:
                note += "G#";
                break;
            case 9:
                note += "A";
                break;
            case 10:
                note += "A#";
                break;
            case 11:
                note += "B";
                break;
        }
        return note;
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


        canvas.clear();
        //snap.clear();

        canvas.rect(0, 0, WORKPIECE_WIDTH, WORKPIECE_HEIGHT).attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: STROKE_WIDTH
        });

        var lowestNote = MIDI_MAX_NOTE_NUMBER;
        var highestNote = MIDI_MIN_NOTE_NUMBER;

        $.each(song, function (i, note) {
            if (note.midi < lowestNote)
                lowestNote = note.midi;
            if (note.midi > highestNote)
                highestNote = note.midi;
            //console.log(note);
        });

        var notesGroup = canvas.g();
        notesGroup.attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: STROKE_WIDTH
        });

        $.each(song, function (i, note) {
            var x = 20 + note.time * 5 + "mm";
            var y = note.midi + "mm";
            var radius = 1 + "mm";
            notesGroup.add(canvas.circle(x, y, radius));
            notesGroup.add(canvas.rect(x, y, "3mm", "2.5mm", "2mm"));
        });

        canvas.text(1, 10, "1C");

        var cardGroup = canvas.g().attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: STROKE_WIDTH
        });


        var startX = 5;
        var endX = 200;
        var startY = 5;
        var endY = startY + 69.7;
        var edgeDifference = 10;

        cardGroup.add(canvas.line(startX + edgeDifference + "mm", startY + "mm", endX + "mm", startY + "mm"));
        cardGroup.add(canvas.line(endX + "mm", startY + "mm", endX - edgeDifference + "mm", endY + "mm"));
        cardGroup.add(canvas.line(endX - edgeDifference + "mm", endY + "mm", startX + "mm", endY + "mm"));
        cardGroup.add(canvas.line(startX + "mm", endY + "mm", startX + edgeDifference + "mm", startY + "mm"));

    }

    /*
     * Playback of the notes
     */
    var playBackLine;
    $("#play").click(function () {
        refreshPreview();
        playBackLine = canvas.line("2mm", "2mm", "2mm", "80mm").attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: STROKE_WIDTH
        });
        Tone.Transport.stop();

        var synth = new Tone.PolySynth(AMOUNT_OF_PINS, Tone.Synth, {
            "oscillator": {
                "type": "square",
                "count": 3,
                "spread": 30
            }
        }).toMaster();
        var vol = new Tone.Volume(VOLUME_VALUE);
        synth.chain(vol, Tone.Master);
        Tone.Transport.bpm.value = BPM;
        new Tone.Part(function (time, note) {
            synth.triggerAttackRelease(note.name, .1, time, 1);

        }, song).start()

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