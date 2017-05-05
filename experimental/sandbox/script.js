/**
 * Created by Andrew on 02-May-17.
 */
var pianoRoll = document.getElementById("piano-roll");

var channels = [];
var validChannels = [];

var midiTrack = [];


var blackNotes = ["C#", "D#", "F#", "G#", "A#"];

var lastEventX = 100;

function loadTrack() {
    var trackSelect = document.getElementById("track-select");
    var trackChoice = trackSelect.options[trackSelect.selectedIndex].value;

    midiTrack = trackList[trackChoice];
    console.dir(midiTrack);
}

function Channel(noteNumber, noteName) {

    this.noteNumber = noteNumber;
    this.noteName = noteName;
    this.isValid = true;
    this.events = [];

}

function isValidChannel(noteNumber) {

    var channelIsValid = false;

    for (var i = 0; i < validChannels.length; i++) {
        if (validChannels[i] == noteNumber) {
            channelIsValid = true;
        }
    }

    return channelIsValid;
}

function isBlackNote(noteName) {
    var isBlack = false;
    for (var i = 0; i < blackNotes.length; i++) {
        if (blackNotes[i] == noteName) {
            isBlack = true;
        }
    }
    return isBlack;
}

function getEvents(noteNumber) {

    midiEvents = [];

    for (var i = 0; i < midiTrack.length; i++) {

        if (midiTrack[i][0] == noteNumber) {
            midiEvents.push(midiTrack[i]);
        }
    }

    return midiEvents;
}

function renderPianoRoll() {

    var roll = document.getElementById("piano-roll");

    for (var i = 0; i < channels.length; i++) {

        var channelDiv = document.createElement("div");
        channelDiv.id = "ch" + i;

        if (channels[i].isValid) {
            channelDiv.setAttribute("class", "channel valid-channel");
        } else {
            channelDiv.setAttribute("class", "channel invalid-channel");
        }


        // make Piano key
        var channelKey = document.createElement("div");
        channelKey.innerHTML = '<p class="key-name">' + channels[i].noteName + '</p>';

        var channelKeyClasses = "channel-key ";

        if (isBlackNote(channels[i].noteName)) {
            channelKeyClasses += "black-note ";
        } else {
            channelKeyClasses += "white-note ";
        }

        channelDiv.appendChild(channelKey);
        channelKey.setAttribute("class", channelKeyClasses);


        channels[i].events = getEvents(channels[i].noteNumber);

        for (var j = 0; j < channels[i].events.length; j++) {
            var midiEvent = document.createElement("div");
            midiEvent.setAttribute("class", "event-dot");
            var styleText = "left:" + (30 + (11 * channels[i].events[j][1]) + "px;");
            console.log(styleText);
            midiEvent.setAttribute("style", styleText);
            channelDiv.appendChild(midiEvent);
        }

        roll.appendChild(channelDiv);

    }

}

function makeChannels() {
    // Page load build of Piano Roll

    var noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    for (var i = 0; i < 128; i++) {

        var noteName = i % 12;
        var ch = new Channel(i, noteNames[noteName]);

        if (isValidChannel(i)) {
            ch.isValid = true;
        }

        ch.events = getEvents(i);

        channels.push(ch);

    }

}


window.onload = function () {

    document.getElementById("track-select").addEventListener("change", loadTrack);

    makeChannels();
    loadTrack();
    renderPianoRoll();

};