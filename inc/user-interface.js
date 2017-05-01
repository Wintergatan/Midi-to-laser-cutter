$(document).ready(function () {
    $("#units").change(function () {
        if ($("#units option:selected").text() == "Inches") {
            $('.unit-suffix').text('in');
        } else {
            $('.unit-suffix').text('mm');
        }

    });

    $("input:file").change(function () {
        var fileName = $(this).val();
        $("#midi-file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
    });

    $("#line-color").change(function () {
        var lineColor = $(this).val().toUpperCase();
        $("#color-suffix").text(lineColor);
    });

    $("#export-settings").click(function () {
        var settings = {
            units: $("#units option:selected").text(),
            workpieceWidth: $("#workpiece-width").val(),
            workpieceHeight: $("#workpiece-height").val(),
            startingEdge: $("#starting-edge option:selected").text(),
            jointEdge: $("#joint-edge option:selected").text(),
            endingEdge: $("#ending-edge option:selected").text(),
            holeShape: $("#hole-shape option:selected").text(),
            holeWidth: $("#hole-width").val(),
            holeHeight: $("#hole-height").val(),
            scale: $("#scale option:selected").text(),
            scaleType: $("#scale-type option:selected").text(),
            scaleMode: $("#scale-mode option:selected").text(),
            amountOfPins: $("#amount-of-pins").val(),
            horizontalMargins: $("#horizontal-margins").val(),
            verticalMargins: $("#vertical-margins").val(),
            exportFormat: $("#export-format option:selected").text(),
            lineColor: $("#line-color").val()
        }
        json_export = JSON.stringify(settings);
        console.log(settings);
        console.log(json_export);
        uriContent = "data:application/octet-stream," + encodeURIComponent(json_export);
        newWindow = window.open(uriContent, 'neuesDokument');
    });

    //MIDIParser.addListener(document.getElementById('file-picker-midi'), function (data) { prepareFiles(data) });
    //console.log("listener added");

    $("#show-preview").click(function () {
        if (loadFile()) {
            $("#download-btn").prop('disabled', false)
        }
    });

    $("#download-btn").click(function () {
        var value = document.getElementById('export-format').options[document.getElementById('export-format').selectedIndex].value;
        downloadFile('data.' + value, fileTexts[value]);
    });

    function loadFile() {
        file = $('#file-picker-midi')[0].files[0];
        if (!file) {
            console.log("No file selected")
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
});