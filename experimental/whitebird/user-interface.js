$(document).ready(function () {
    // No magic numbers
    var MIDI_MIN_NOTE_NUMBER = 0;
    var MIDI_MAX_NOTE_NUMBER = 127;
    var MIDI_NUMBER_OF_NOTES = 12;

    // Enums, settings, variables and help functions used throughout the document
    var unitEnum = {
        millimeters: "mm",
        inches: "in"
    };
    var fileFormatEnum = {
        SVG: "SVG",
        DXF: "DXF"
    }
    var settings = {
        board: [{ name: "A7", midi: 93 }, { name: "G7", midi: 91 }, { name: "F7", midi: 89 }, { name: "E7", midi: 88 }, { name: "D7", midi: 86 }, { name: "C7", midi: 84 }, { name: "B6", midi: 83 }, { name: "A6", midi: 81 }, { name: "G6", midi: 79 }, { name: "F6", midi: 77 }, { name: "E6", midi: 76 }, { name: "D6", midi: 74 }, { name: "C6", midi: 72 }, { name: "B5", midi: 71 }, { name: "A5", midi: 69 }, { name: "G5", midi: 67 }, { name: "F5", midi: 65 }, { name: "E5", midi: 64 }, { name: "D5", midi: 62 }, { name: "C5", midi: 60 }],
        workpiece: {
            width: 600,
            height: 300
        },
        note: {
            width: 6,
            height: 2.5,
            rounding: 2
        },
        // Margin is workpiece offsets
        margin: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 6
        },
        // Padding is offset inside the music strip
        padding: {
            top: 6.35,
            right: 5,
            bottom: 5,
            left: 10
        },
        fontSize: 3,
        stripHeight: 69.7,
        lineHeight: 3,
        unit: unitEnum.millimeters,
        volume: -6,
        bpm: 120,
        strokeWidth: 1,
        endOffset: 10,
        edgeDifference: 10,
        showBadNotes: true,
        export: {
            fileFormat: fileFormatEnum.svg
        }
    };

    // Currently it is the length of the music strip, has to be replaced with the length of the longest strip.
    var endX;
    // same for height
    var endY;

    var song;
    var goodNotes;

    function addUnit(distance) {
        return distance + settings.unit;
    }

    /*
     * Configuration user interface
     */
    $("#units").change(function () {
        if ($("#units option:selected").val() == unitEnum.inches) {
            $('.unit-suffix').text(unitEnum.inches);
        } else {
            $('.unit-suffix').text(unitEnum.millimeters);
        }
        settings.unit = $("#units option:selected").val();

    });

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

        endX = settings.margin.left + (2 * settings.edgeDifference) + settings.padding.left + (notes[notes.length - 1].time * 20) + settings.note.width + settings.padding.right;
        endY = settings.margin.top + settings.stripHeight;

        cardGroup.add(canvas.line(
            addUnit(settings.margin.left + settings.edgeDifference),
            addUnit(settings.margin.top),
            addUnit(endX + settings.padding.right),
            addUnit(settings.margin.top)
        ));
        cardGroup.add(canvas.line(
            addUnit(endX + settings.padding.right),
            addUnit(settings.margin.top),
            addUnit(endX - settings.edgeDifference + settings.padding.right),
            addUnit(endY)));
        cardGroup.add(canvas.line(
            addUnit(endX - settings.edgeDifference + settings.padding.right),
            addUnit(endY),
            addUnit(settings.margin.left),
            addUnit(endY)
        ));
        cardGroup.add(canvas.line(
            addUnit(settings.margin.left),
            addUnit(endY),
            addUnit(settings.margin.left + settings.edgeDifference),
            addUnit(settings.margin.top)
        ));

        var noteNamesGroup = canvas.g().attr({
            'font-size': addUnit(settings.fontSize),
            'text-anchor': "end"
        });

        var gridLinesGroup = canvas.g().attr({
            fill: "none",
            stroke: "#000000",
            strokeWidth: settings.strokeWidth
        });

        // Note lines
        for (var i = 0; i < settings.board.length; i++) {
            var x = settings.margin.left + settings.edgeDifference + settings.padding.left;
            var y = settings.margin.top + settings.padding.top + (i * settings.lineHeight);
            gridLinesGroup.line(addUnit(x), addUnit(y), addUnit(endX - settings.edgeDifference), addUnit(y));
            noteNamesGroup.text(addUnit(x - 1), addUnit(y + (settings.fontSize / 3)), settings.board[i].name);
        }

        // Vertical lines
        var verticalLineY1 = settings.margin.top + settings.padding.top;
        var verticalLineY2 = verticalLineY1 + ((settings.board.length - 1) * settings.lineHeight);
        var verticalLineX = settings.margin.left + settings.edgeDifference + settings.padding.left;
        while (verticalLineX < endX - settings.edgeDifference) {
            gridLinesGroup.line(addUnit(verticalLineX), addUnit(verticalLineY1), addUnit(verticalLineX), addUnit(verticalLineY2));
            verticalLineX += (10);
        }

        goodNotes = [];
        var amountOfBadNotes = 0;
        $.each(notes, function (i, note) {
            var x = settings.margin.left + settings.edgeDifference + settings.padding.left + note.time * 20;
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
                y = settings.margin.top + settings.padding.top + (boardIndex * settings.lineHeight);
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
                if (settings.showBadNotes) {
                    badNotesGroup.add(canvas.rect(
                        addUnit(x),
                        addUnit(settings.margin.top),
                        addUnit(settings.note.width),
                        addUnit(settings.note.height),
                        addUnit(settings.note.rounding)
                    ));
                }
            }
        });
        console.log("There are " + amountOfBadNotes + " bad notes")
    }

    function drawGrid(target) {

    }

    /*
     * Playback of the notes
     */
    var playBackLine;
    $("#play").click(function () {
        refreshPreview();
        var playBackLineStart = addUnit(settings.margin.left + settings.edgeDifference + settings.padding.left);
        playBackLine = canvas.line(
            playBackLineStart,
            addUnit(settings.margin.top),
            playBackLineStart,
            addUnit(settings.margin.top + settings.stripHeight)
        ).attr({
            fill: "none",
            stroke: "#0000FF",
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
        // TODO bpm is not changing?
        Tone.Transport.bpm.value = settings.bpm;
        new Tone.Part(function (time, note) {
            synth.triggerAttackRelease(note.name, .1, time, 1);

        }, goodNotes).start()

        Tone.Transport.start();
        var playBackLineEnd = addUnit(settings.margin.left + settings.edgeDifference + settings.padding.left);
        var playBackLineEnd = addUnit(endX - settings.edgeDifference - settings.padding.right);
        // TODO: how to calculate speed in relation to BPM
        playBackLine.animate({ x1: playBackLineEnd, x2: playBackLineEnd }, 110000);
    });

    $("#stop").click(function () {
        Tone.Transport.stop()
        playBackLine.stop();
        playBackLine.remove();
        //playBackLine.attr({ x1: "2mm", x2: "2mm" });
    });

    /*
     * Exporting 
     */

    $("#line-color").change(function () {
        var lineColor = $(this).val().toUpperCase();
        $("#color-suffix").text(lineColor);
    });

    $("#download-btn").click(function () {
        switch ($('#export-format option:selected').val()) {
            case "svg":
                // to be replaced with export SVG
                var rawSvg = snap.outerSVG();
                var svg = new Blob([rawSvg], { type: "image/svg+xml;charset=utf-8" })
                saveAs(svg, "output.svg");
                break;
            case "dxf":
                break;
        }

    });
});