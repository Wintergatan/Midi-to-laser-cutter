$(document).ready(function () {

    /*
     * Load Midi file and select track
     */
    var MIDI_MIN_NOTE_NUMBER = 0;
    var MIDI_MAX_NOTE_NUMBER = 127;
    var MIDI_NUMBER_OF_NOTES = 12;
    var song;

    $("#file-picker-midi").change(function () {
        var fileName = $(this).val();
        $("#midi-file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
        var file = $('#file-picker-midi')[0].files[0];
        loadMidiFile(file)
        //$("#download-btn").prop('disabled', false)
    });

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
            console.log(song);
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
        reader.readAsBinaryString(file);
        return true;
    }

    $('#selectTrackForm').submit(function (e) {
        e.preventDefault();
        $('#trackModal').modal('hide');
        var i = $('#trackPicker option:selected').val();
        song = song.tracks[i].notes;
        console.log(song)
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

    $("#show-preview").click(function () {
        refreshPreview();
    });

    function refreshPreview() {
        var lowestNote = MIDI_MAX_NOTE_NUMBER;
        var highestNote = MIDI_MIN_NOTE_NUMBER;
        $.each(song, function (i, note) {
            if (note.midi < lowestNote)
                lowestNote = note.midi;
            if (note.midi > highestNote)
                highestNote = note.midi;
            console.log(note);
        });

        $.each(song, function (i, note) {
            // x y r
            snap.circle(20 + note.time * 100, note.midi, 5);
        });
        
    }

    /*
     * Exporting options
     */

    $("#line-color").change(function () {
        var lineColor = $(this).val().toUpperCase();
        $("#color-suffix").text(lineColor);
    });
});