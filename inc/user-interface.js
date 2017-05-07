$(document).ready(function () {

    var fields = [
        { name: 'units', type: 'select', id: 'units' },
        { name: 'workpieceWidth', type: 'text', id: 'workpiece-width' },
        { name: 'workpieceHeight', type: 'text', id: 'workpiece-height' },
        { name: 'stripHeight', type: 'text', id: 'strip-height' },
        { name: 'scale', type: 'select', id: 'scale' },
        { name: 'scaleType', type: 'select', id: 'scale-type' },

        { name: 'startingEdge', type: 'select', id: 'starting-edge' },
        { name: 'jointEdge', type: 'select', id: 'joint-edge' },
        { name: 'endingEdge', type: 'select', id: 'ending-edge' },
        { name: 'amountOfPins', type: 'text', id: 'amount-of-pins' },

        { name: 'holeShape', type: 'select', id: 'hole-shape' },
        { name: 'holeWidth', type: 'text', id: 'hole-width' },
        { name: 'holeHeight', type: 'text', id: 'hole-height' },
        { name: 'horizontalMargins', type: 'text', id: 'horizontal-margins' },
        { name: 'verticalMargins', type: 'text', id: 'vertical-margins' },

        { name: 'exportFormat', type: 'select', id: 'export-format' },
        { name: 'lineColor', type: 'text', id: 'line-color' }
    ];

    $("#units").change(function () {
        if ($("#units option:selected").text() == "Inches") {
            $('.unit-suffix').text('in');
        } else {
            $('.unit-suffix').text('mm');
        }

    });

    $("#file-picker-midi").change(function () {
        var fileName = $(this).val();
        $("#midi-file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
    });

    $("#line-color").change(function () {
        var lineColor = $(this).val().toUpperCase();
        $("#color-suffix").text(lineColor);
    });

    $("#import-settings").click(function () {
        if (confirm('Are you sure you want to overwrite your current configuration?')) {
            $("#file-picker-import-settings").trigger('click');
        }
    });

    $("#file-picker-import-settings").change(function () {
        var file = $('#file-picker-import-settings')[0].files[0];
        importSettings(file);
    });

    $("#export-settings").click(function () {
        var settings = { };
        fields.forEach(function (field) {
            settings[field.name] = $('#' + field.id).val();
        });

        console.log(settings);

        json_export = JSON.stringify(settings);
        console.log(settings);
        console.log(json_export);

        var element = document.createElement('a');
        element.setAttribute('href', "data:application/json;charset=utf-8," + encodeURIComponent(json_export));
        element.setAttribute('download', 'settings.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    });

    //MIDIParser.addListener(document.getElementById('file-picker-midi'), function (data) { prepareFiles(data) });
    //console.log("listener added");

    $("#show-preview").click(function () {
        if (! validateForm()) {
            return;
        }
        var file = $('#file-picker-midi')[0].files[0];
        if (loadMidiFile(file)) {
            $("#download-btn").prop('disabled', false)
        }
    });

    $("#download-btn").click(function () {
        var value = document.getElementById('export-format').options[document.getElementById('export-format').selectedIndex].value;
        downloadFile('data.' + value, fileTexts[value]);
    });

    function importSettings (file) {
        if (!file) {
            console.log("No settings file selected")
            return false;
        }
        console.log('Attempting to load settings from ' + file.name);
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            var settings = JSON.parse(e.target.result);
            console.log(settings);

            fields.forEach(function (field) {
                if (settings[field.name]) {
                    if (field.type === 'text') {
                        $('#' + field.id).val(settings[field.name]);
                    }
                    else if (field.type === 'select') {
                        $('#' + field.id).val(settings[field.name]).change();
                    }
                    else {
                        console.log('Invalid field type: ' + field.type);
                    }
                }
            });
        };
    }

    function loadMidiFile(file) {
        if (!file) {
            console.log("No Midi file selected")
            return false;
        }
        console.log('Uploading file detected in INPUT ELEMENT, processing data..');
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            console.log(e.target.result);
            prepareFiles(MIDIParser.Uint8(new Uint8Array(e.target.result)));
        };
        return true;
    }

    function validateForm() {
        // For now, simply verify the user has selected a MIDI file
        // Will add min/max, defaults, required/optional once those attributes are identified by the team

        var file = $('#file-picker-midi')[0].files[0];
        if (!file) {
            alert('Please select a valid MIDI file.')
            return;
        }

        return true;
    }
});