// Global variables and constants
var noteNames = ["C", "Db/C#", "D", "Eb/D#", "F", "Gb/F#", "G", "Ab/G#", "A", "B"];
var templatesDirectory = "../templates/";

// Global objects
var workingTrack = undefined;
var screenDevice = undefined;
var workingDevice = undefined;

// Interface settings
var currentRenderType = "screenRender";
var showLongNotes = true;


///////////////////////////////
// Utility Functions
///////////////////////////////

function compare(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}
////////////////////////////////////////////////////////////////





//
// var midi_pitches_letter =  { '12':'c', '13':'c#', '14':'d', '15':'d#', '16':'e', '17':'f', '18':'f#', '19':'g', '20':'g#', '21':'a', '22':'a#', '23':'b' };
// var midi_flattened_notes = { 'a#':'bb', 'c#':'db', 'd#':'eb', 'f#':'gb', 'g#':'ab' };
//
//
// function noteNumberToNoteName(noteNumber, showOctave,  returnFlattened) {
//     var octave = 0;
//     var noteNum = noteNumber;
//     var noteName;
//
//     if (noteNumber > 23) {
//         // noteNum is on octave 1 or more
//         octave = Math.floor(noteNumber/12) - 1;
//         // subtract number of octaves from noteNum
//         noteNum = noteNumber - octave * 12;
//     }
//
//     // get note name (c#, d, f# etc)
//     noteName = midi_pitches_letter[noteNum];
//     // Use flattened notes if requested (e.g. f# should be output as gb)
//     if (returnFlattened && noteName.indexOf('#') > 0) {
//         noteName = midi_flattened_notes[noteName];
//     }
//     if(showOctave){
//         noteName += octave;
//     }
//     return noteName;
// }


/////////////////////////////////////////////////////////


// function noteNumberToNoteName(noteNumber, showOctave) {
//
//     // TODO allow french note names and drum instrument names
//
//     var noteNameIndex = noteNumber % 10;
//
//     // TODO check logic below for calculating octave number
//     var octave = (Math.floor(noteNumber / 12)).toString();
//
//     var noteName = noteNames[noteNameIndex];
//
//     if (showOctave == true) {
//         noteName += octave;
//     }
//
//     return noteName;
// }

// Temporary helper function
function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
}


///////////////////////////////
// MidiTrack object and methods
///////////////////////////////

function MidiTrack() {
    this.ppq = 256;
    this.currentTempo = 500000;
    this.events = [];
    this.metaChannel = [];
    this.channels = [];
    //this.shortestDeltaT = Number.MAX_SAFE_INTEGER;  // check for compatibility will all browsers
    this.shortestDeltaT = Number.MAX_SAFE_INTEGER;  // check for compatibility will all browsers

    this.clearChannels();

}

MidiTrack.prototype.setEvents = function (midiData, sort) {

    for (var i = 0; i < midiData.tracks; i++) {
        var currentTick = 0;
        for (var j = 0; j < midiData.track[i].event.length; j++) {
            var event = midiData.track[i].event[j];
            currentTick += event.deltaTime;

            if (event.type == 9 || event.type == 8) { // note on events

                var noteAction = event.type == 9 ? "on" : "off";

                var evt = new MidiEvent("note", noteAction, currentTick, event.data[0]);  // get pitch

                this.events.push(evt);

            }
            else if (event.type == 255) { // meta events

                if (event.metaType == 81) { // tempo change events
                    var mEvt = new MidiEvent("tempo", undefined, currentTick, undefined, undefined, event.data);
                    this.events.push(mEvt);
                }
            }

        }
    }

    if (sort) {
        this.events.sort(function (a, b) {
            return compare(a.pitch, b.pitch)
        });
    }
};

MidiTrack.prototype.clearChannels = function () {
    this.channels = [];
    this.createChannels();
};

MidiTrack.prototype.createChannels = function () {
    for (var i = 0; i < 128; i++) {

        var channelName = noteNumberToNoteName(i,true);
        var channel = new MidiChannel(i, channelName, true);
        this.channels.push(channel);
    }
};

MidiTrack.prototype.shortChannelEvents = function (channel) {

    channel.events.sort(function (a, b) {
        return compare(a.tick, b.tick);
    })

};

MidiTrack.prototype.calculateShortestDeltaT = function () {

    for (var i = 0; i < this.channels.length; i++) {
        var channel = this.channels[i];
        //console.log("working on channel: " + channel.noteNumber);

        for (var j = 0; j < channel.events.length - 1; j++) {

            var deltaT = channel.events[j + 1].tick - channel.events[j].tick;
            if (deltaT < this.shortestDeltaT) this.shortestDeltaT = deltaT;
        }
    }

};

MidiTrack.prototype.eventsToChannels = function (midiEvents) {

    for (var i = 0; i < midiEvents.length; i++) {

        var midiEvent = midiEvents[i];

        if (midiEvent.eventType == "note") {

            var midiNoteNumber = parseInt(midiEvent.noteNumber);
            var channel = this.channels[midiNoteNumber];
            channel.events.push(midiEvent);

        } else if (midiEvent.eventType == "tempo") {
            this.metaChannel.push(midiEvent);
        }
    }

    // Sort events in channels
    for (var i = 0; i < this.channels.length; i++) {
        var channel = this.channels[i];
        channel.sortChannelEvents();
    }

    this.calculateShortestDeltaT();

};

MidiTrack.prototype.setChannelName = function (noteNumber, channelName) {

    console.log("original channel name: " + this.channels[noteNumber].channelName);

    this.channels[noteNumber].channelName = channelName;

    console.log("changed channel name: " + this.channels[noteNumber].channelName);

};

MidiTrack.prototype.getChannelName = function (noteNumber) {
    return this.channels[noteNumber].channelName;
};

///////////////////////////////
// MidiChannel object and methods
///////////////////////////////

function MidiChannel(noteNumber, channelName, isValid) {
    this.noteNumber = noteNumber;
    this.channelName = channelName;
    this.isValid = isValid;
    this.channelDescription = "";
    this.events = [];

}

MidiChannel.prototype.sortChannelEvents = function () {

    this.events.sort(function (a, b) {
        return compare(a.tick, b.tick);
    })

};

MidiChannel.prototype.addMidiEvent = function (midiEvent) {

};

MidiChannel.prototype.deleteMidiEvent = function (midiEvent) {

};

MidiChannel.prototype.recalculateDeltaTs = function () {

};


///////////////////////////////
// MidiEvent object and methods
///////////////////////////////

function MidiEvent(eventType, noteAction, tick, note, tempo, eventData) {
    this.eventType = eventType;
    this.noteAction = noteAction;
    this.tick = tick;
    this.noteNumber = note;
    this.tempo = tempo;
    this.eventData = eventData;

}

MidiEvent.prototype.getNoteName = function (showOctave) {

    return noteNumberToNoteName(this.noteNumber, showOctave);

};


///////////////////////////////
// Device object and methods
///////////////////////////////

function Device(deviceName) {

    this.deviceName = deviceName;
    this.description = "";
    this.paperSpeed = 1;

    this.minDistBetweenNotes = 11;
    this.channelHeight = 10;
    this.eventHeight = 10;
    this.eventWidth = 10;

    this.topPadding = 6;
    this.rightPadding = 50;
    this.bottomPadding = 6;
    this.leftPadding = 50;

    // Array to store DeviceChannels
    this.validChannels = [];

}

Device.prototype.applySettings = function(deviceSettings){

    for (var property in deviceSettings) {
        if (deviceSettings.hasOwnProperty(property)) {

            if(property == "validChannels"){

                this.validChannels = [];

                // Create DeviceChannel objects
                for(var i = 0; i < deviceSettings['validChannels'].length; i++){
                    //console.log(deviceSettings['validChannels'][i]['noteNumber']);
                    var noteNumber = deviceSettings['validChannels'][i]['noteNumber'];
                    var noteName = deviceSettings['validChannels'][i]['name'];
                    var description = deviceSettings['validChannels'][i]['description'];

                    var deviceChannel = new DeviceChannel(noteNumber, noteName, description);
                    this.validChannels.push(deviceChannel);
                }
            } else {
                this[property] = deviceSettings[property];
            }
        }
    }
};

Device.prototype.setChannelOffset = function (channelIndex, offset) {

    var deviceChannel = this.validChannels[channelIndex];
    deviceChannel["offset"] = offset;

};

Device.prototype.isValidDeviceChannel = function (noteNumber) {

    // Return true if the MIDI note number has been assigned to any
    // channel in this.validChannels

    var channelIsValid = false;
    var validChannels = this.validChannels;
    for (var i = 0; i < validChannels.length; i++) {
        var channelToCheck = this.validChannels[i];
        if (channelToCheck['noteNumber'] == noteNumber) {
            channelIsValid = true;
        }
    }

    return channelIsValid;

};

Device.prototype.addValidChannel = function (deviceChannel) {
    this.validChannels.push(deviceChannel);
};

Device.prototype.removeValidChannel = function (channelIndex) {
    this.validChannels.splice(channelIndex, 1);
};

Device.prototype.clearValidChannels = function () {
    this.validChannels = [];
};

// Device helper function
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Device.prototype.moveChannel = function(fromIndex, toIndex){
    console.log(fromIndex + " : " + toIndex);
    this.validChannels.move(fromIndex, toIndex);
};


////////////////////////////////////
// DeviceChannel object and methods
////////////////////////////////////

function DeviceChannel(noteNumber, channelName, description) {
    this.noteNumber = noteNumber;
    this.name = channelName;
    this.description = description;
    this.offset = 0;
    this.height = 0;
}


////////////////////////////////////
// Rendering
////////////////////////////////////

function clearRender(elem) {
    if (elem.hasChildNodes) {
        while (elem.childNodes.length >= 1) {
            elem.removeChild(elem.firstChild);
        }
    }
}

function renderTrack(elem, track, renderType) {

    clearRender(elem);

    // TODO
    // -decide whether or not to use a library for SVG rendering
    // -get topmost and bottommost element with events centre vertical scroll between them
    // -render track headers - notes, channel names, (toggle validity, double-click-edit)
    // - lots of refactoring to do here
    // - decisions on final look-and-feel, styles and methods of rendering


    // TODO figure out what this does...
    //var paperSpeed = device.paperSpeed;

    var paperSpeed = workingDevice.minDistBetweenNotes / track.shortestDeltaT;
    var screenPaperSpeed = screenDevice.minDistBetweenNotes / track.shortestDeltaT;

    // Temporary render function for testing
    // This will be replaced by code that builds a Maker.js model

    var trackChannels = track.channels;
    var maxX = 0;  // to set final width space for display

    // Some variables to allow auto-scrolling to bring events into view
    var minY = 2000;
    var maxY = 0;
    var midY = 1000;

    if (renderType == "screenRender") {

        // Renders all 128 MIDI channels from MIDI track
        // If device is set highlights invalid/valid channels
        // Screen device dimension settings used

        var svgPianoRoll = getNode('svg');
        svgPianoRoll.setAttribute('id', 'svg-piano-roll');
        svgPianoRoll.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:mididata", "xmlns=http://yuleblinker.com/midimusicbox");
        svgPianoRoll.setAttribute('viewbox', '0 0 3000 2000');
        svgPianoRoll.setAttribute('width', '3000px');
        svgPianoRoll.setAttribute('height', '2000px');

        for (var i = 0; i < trackChannels.length; i++) {

            var channel = trackChannels[i];
            var events = trackChannels[i].events;
            var channelName = trackChannels[i].channelName;

            var svgChannelId = "channel_" + i;
            var svgChannel = getNode('g');
            svgChannel.setAttribute('mididata:channel', i);
            svgChannel.setAttribute('x', '0');
            svgChannel.setAttribute('y', '0');
            svgChannel.setAttribute('width', '3000px');
            svgChannel.setAttribute('height', screenDevice.channelHeight + "px");

            var channelClass = 'svg-channel';
            // Set class based on validity of channel
            if (workingDevice.isValidDeviceChannel(i)) {
                channelClass += " valid";
            } else {
                channelClass += " invalid";
            }

            var channelY = ((i + 1) * screenDevice.channelHeight);
            var transformValue = "translate(0," + channelY + ")";

            svgChannel.setAttribute('transform', transformValue);

            var channelRect = getNode('rect');
            channelRect.setAttribute('id', "channel_back_" + i);
            channelRect.setAttribute('class', channelClass);
            channelRect.setAttribute('x', '0');
            channelRect.setAttribute('y', '0');
            channelRect.setAttribute('width', '3000px');
            channelRect.setAttribute('height', screenDevice.channelHeight + "px");

            svgChannel.appendChild(channelRect);

            // Add events to channel
            for (var j = 0; j < events.length; j++) {

                var evt = events[j];

                if (evt.noteAction == "on") {

                    var noteOffEvent = events[j + 1];
                    var noteLength = ((noteOffEvent.tick - evt.tick) * screenPaperSpeed);

                    var noteData = evt.noteNumber + "_" + channelName + "_" + evt.noteAction + "_" + evt.tick;

                    var evtXPos = (evt.tick * screenPaperSpeed);  // scale this to units we want e.g pixels or mm

                    // Add a bit of space after - maybe get from device
                    if (evtXPos > maxX) {
                        maxX = evtXPos + screenDevice.rightPadding;
                    }

                    var noteHeight = screenDevice.eventHeight;

                    var noteWidth = screenDevice.eventWidth;
                    if (showLongNotes) {
                        noteWidth = noteLength;
                    }

                    var svgEvent = getNode('rect');
                    var eventId = "note_" + i + "_" + j;
                    svgEvent.setAttribute('id', eventId);
                    svgEvent.setAttribute('mididata:notedata', noteData);
                    svgEvent.setAttribute('width', noteWidth + "px");
                    svgEvent.setAttribute('height', noteHeight + "px");
                    svgEvent.setAttribute('x', evtXPos);
                    svgEvent.setAttribute('y', '0');
                    svgEvent.setAttribute('rx', '3');
                    svgEvent.setAttribute('ry', '3');
                    svgEvent.setAttribute('class', 'svg-note');

                    svgEvent.addEventListener('click', svgNoteClick);

                    // Keep track of event Ys to enable scrolling to where events appear
                    if (channelY < minY) {
                        minY = channelY;
                    }
                    if (channelY > maxY) {
                        maxY = channelY;
                    }

                    svgChannel.appendChild(svgEvent);

                }

            }

            svgPianoRoll.appendChild(svgChannel);
        }

        elem.appendChild(svgPianoRoll);


        midY = (minY + maxY) / 2;
        // Scroll to where events are in Piano Roll
        document.getElementById('track-output').scrollTop = minY;
        document.getElementById('secondary-view').scrollTop = minY;

        //console.log("Minimum Y: " + minY + " Maximum Y: " + maxY + " Middle Y: " + midY);

    }

    if (renderType == "screenCollapsedRender") {

        // Renders only the MIDI tracks that match the selected devices valid channels
        // Screen device dimension settings used

        var numValidChannels = screenDevice.validChannels.length;
        var pianoRollHeight = numValidChannels * screenDevice.channelHeight;

        var svgPianoRoll = getNode('svg');
        svgPianoRoll.setAttribute('id', 'svg-piano-roll');
        svgPianoRoll.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:mididata", "xmlns=http://yuleblinker.com/midimusicbox");
        svgPianoRoll.setAttribute('viewbox', '0 0 3000 ' + pianoRollHeight);
        svgPianoRoll.setAttribute('width', '3000px');
        svgPianoRoll.setAttribute('height', pianoRollHeight + 'px');

        var channelsProcessed = 0;

        for (var i = 0; i < trackChannels.length; i++) {

            if (workingDevice.isValidDeviceChannel(i)) {

                // Only render valid device channels

                var channel = trackChannels[i];
                var events = trackChannels[i].events;
                var channelName = trackChannels[i].channelName;

                var svgChannelId = "channel_" + i;
                var svgChannel = getNode('g');
                svgChannel.setAttribute('mididata:channel', i);
                svgChannel.setAttribute('x', '0');
                svgChannel.setAttribute('y', '0');
                svgChannel.setAttribute('width', '3000px');
                svgChannel.setAttribute('height', screenDevice.channelHeight + "px");

                var channelClass = 'svg-channel';
                // Set class based on validity of channel
                if (workingDevice.isValidDeviceChannel(i)) {
                    channelClass += " valid";
                } else {
                    channelClass += " invalid";
                }

                var channelY = ((channelsProcessed + 1) * screenDevice.channelHeight);
                var transformValue = "translate(0," + channelY + ")";

                svgChannel.setAttribute('transform', transformValue);

                var channelRect = getNode('rect');
                channelRect.setAttribute('id', "channel_back_" + i);
                channelRect.setAttribute('class', channelClass);
                channelRect.setAttribute('x', '0');
                channelRect.setAttribute('y', '0');
                channelRect.setAttribute('width', '3000px');
                channelRect.setAttribute('height', screenDevice.channelHeight + "px");

                svgChannel.appendChild(channelRect);

                // Add events to channel
                for (var j = 0; j < events.length; j++) {

                    var evt = events[j];

                    if (evt.noteAction == "on") {

                        var noteData = evt.noteNumber + "_" + channelName + "_" + evt.noteAction + "_" + evt.tick;

                        var evtXPos = (evt.tick * screenPaperSpeed);  // scale this to units we want e.g pixels or mm

                        // Add a bit of space after - maybe get from device
                        if (evtXPos > maxX) {
                            maxX = evtXPos + screenDevice.rightPadding;
                        }

                        var svgEvent = getNode('rect');
                        var eventId = "note_" + i + "_" + j;
                        svgEvent.setAttribute('id', eventId);
                        svgEvent.setAttribute('mididata:notedata', noteData);
                        svgEvent.setAttribute('width', screenDevice.eventWidth + "px");
                        svgEvent.setAttribute('height', screenDevice.eventHeight + "px");
                        svgEvent.setAttribute('x', evtXPos);
                        svgEvent.setAttribute('y', '0');
                        svgEvent.setAttribute('rx', '3');
                        svgEvent.setAttribute('ry', '3');
                        svgEvent.setAttribute('class', 'svg-note');

                        svgEvent.addEventListener('click', svgNoteClick);

                        // Keep track of event Ys to enable scrolling to where events appear
                        if (channelY < minY) {
                            minY = channelY;
                        }
                        if (channelY > maxY) {
                            maxY = channelY;
                        }

                        svgChannel.appendChild(svgEvent);

                    }

                }

                svgPianoRoll.appendChild(svgChannel);
                channelsProcessed++;
            }

            elem.appendChild(svgPianoRoll);

            midY = (minY + maxY) / 2;
            // Scroll to where events are in Piano Roll
            document.getElementById('track-output').scrollTop = minY;
            document.getElementById('secondary-view').scrollTop = minY;
        }

    }

    if (renderType == "stripRender") {

        // Renders only the MIDI tracks that match the selected devices valid channels
        // User's device dimension settings used
        // Renders single strip for whole track

        var units = "mm";

        // If user hasn't selected a device yet use pixels
        // if they have selected a device use mm so output can be saved to file
        if (workingDevice["deviceName"].toLocaleLowerCase() == "screen") {
            console.log("Working device is screen");
            units = "px";
        }

        var numValidChannels = workingDevice.validChannels.length;

        // TODO account for individually set channel offsets
        var pianoRollHeight = workingDevice.bottomPadding + (numValidChannels * workingDevice.channelHeight) + workingDevice.topPadding;

        var svgPianoRoll = getNode('svg');
        svgPianoRoll.setAttribute('id', 'svg-piano-roll');
        svgPianoRoll.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:mididata", "xmlns=http://yuleblinker.com/midimusicbox");
        svgPianoRoll.setAttribute('height', pianoRollHeight + units);


        var channelsProcessed = 0;

        for (var i = 0; i < trackChannels.length; i++) {

            if (workingDevice.isValidDeviceChannel(i)) {

                // Only render valid device channels

                var channel = trackChannels[i];
                var events = trackChannels[i].events;
                var channelName = trackChannels[i].channelName;

                var svgChannelId = "channel_" + i;
                var svgChannel = getNode('g');
                svgChannel.setAttribute('mididata:channel', i);
                svgChannel.setAttribute('x', '0');
                svgChannel.setAttribute('y', '0');
                svgChannel.setAttribute('width', '3000' + units);  // TODO figure out width from device and events
                svgChannel.setAttribute('height', workingDevice.channelHeight + units); // TODO deal with mm vs pixels

                var channelClass = 'svg-channel strip';

                var channelY = ((channelsProcessed + 1) * workingDevice.channelHeight) + workingDevice.bottomPadding;
                if (units == "mm") {
                    channelY *= 3.543307; // convert user units to mm
                }
                var transformValue = "translate(0," + channelY + ")";

                svgChannel.setAttribute('transform', transformValue);

                var channelRect = getNode('rect');
                channelRect.setAttribute('id', "channel_back_" + i);
                channelRect.setAttribute('class', channelClass);
                channelRect.setAttribute('x', '0');
                channelRect.setAttribute('y', '0');
                channelRect.setAttribute('width', '3000' + units); // TODO figure out width from device and events
                channelRect.setAttribute('height', workingDevice.channelHeight + units);

                //svgChannel.appendChild(channelRect);

                // Add events to channel
                for (var j = 0; j < events.length; j++) {

                    var evt = events[j];

                    if (evt.noteAction == "on") {

                        var noteData = evt.noteNumber + "_" + channelName + "_" + evt.noteAction + "_" + evt.tick;

                        var evtXPos = (evt.tick * paperSpeed) + workingDevice.leftPadding;  // scale this to units we want e.g pixels or mm

                        // Add a bit of space after - maybe get from device
                        if (evtXPos > maxX) {
                            maxX = evtXPos + workingDevice.rightPadding;
                        }

                        var svgEvent = getNode('circle');
                        var eventId = "note_" + i + "_" + j;
                        svgEvent.setAttribute('id', eventId);
                        svgEvent.setAttribute('mididata:notedata', noteData);
                        svgEvent.setAttribute('width', workingDevice.eventWidth + units);
                        svgEvent.setAttribute('height', workingDevice.eventHeight + units);
                        svgEvent.setAttribute('cx', evtXPos + units);
                        svgEvent.setAttribute('cy', '0');

                        var eventShapeRadius = (workingDevice.eventHeight) / 2;
                        svgEvent.setAttribute('r', eventShapeRadius + units);

                        svgEvent.setAttribute('class', 'svg-strip-note');

                        svgEvent.addEventListener('click', svgNoteClick);

                        // Keep track of event Ys to enable scrolling to where events appear
                        if (channelY < minY) {
                            minY = channelY;
                        }
                        if (channelY > maxY) {
                            maxY = channelY;
                        }

                        svgChannel.appendChild(svgEvent);

                    }
                }

                svgPianoRoll.appendChild(svgChannel);
                channelsProcessed++;
            }

            elem.appendChild(svgPianoRoll);

            midY = (minY + maxY) / 2;
            // Scroll to where events are in Piano Roll
            document.getElementById('track-output').scrollTop = minY;
            document.getElementById('secondary-view').scrollTop = minY;
        }

        // Add strip border rect
        var stripRect = getNode('rect');
        stripRect.setAttribute('id', "strip-rect");
        stripRect.setAttribute('class', 'strip-border');
        stripRect.setAttribute('x', '0');
        stripRect.setAttribute('y', '0');
        var stripRightEdge = maxX + workingDevice.rightPadding;
        stripRect.setAttribute('width', stripRightEdge + units);
        stripRect.setAttribute('height', pianoRollHeight + units);

        svgPianoRoll.insertBefore(stripRect, svgPianoRoll.children[0]);

        svgPianoRoll.setAttribute('viewbox', '0 0 ' + stripRightEdge + units + ' ' + pianoRollHeight + units);
        svgPianoRoll.setAttribute('width', stripRightEdge + units);

    }

    if (renderType == "pageRender") {

        // Renders strip 'chunks' tiled on selected paper size
        // TODO create page layout objects and use here
    }


}




////////////////////////////////////
// User interaction and interface
////////////////////////////////////

function svgNoteClick(e) {
    var noteData = e.target.getAttribute('mididata:notedata');
    var outputPara = document.getElementById("output");
    outputPara.innerHTML = noteData;
}

function loadMidiFile(file) {
    if (!file) {
        console.log("No Midi file selected");
        return false;
    }
    console.log('Uploading file detected in INPUT ELEMENT, processing data..');

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {

        // Parse MIDI data from file
        var midiData = MIDIParser.Uint8(new Uint8Array(e.target.result));
        // Create new MidiTrack object
        workingTrack = new MidiTrack();
        workingTrack.setEvents(midiData, false);
        workingTrack.eventsToChannels(workingTrack.events, true);

        // Render with MIDI track loaded
        renderTrack(document.getElementById('piano-roll'), workingTrack, "screenRender");

        var secondaryView = document.getElementById("secondary-view");
        renderTrack(secondaryView, workingTrack, "stripRender");

    };

    return true;
}

function setDevice() {

    // Get user choice of known devices
    var deviceSelect = document.getElementById('device-select');
    var deviceChoice = deviceSelect.options[deviceSelect.selectedIndex].value;

    // Use choice to select a known device
    if (deviceChoice != "none") {

        // Grab settings from devices.js
        var userDeviceSettings = knownDevices[deviceChoice];

        // Copy properties of known device to working device
        workingDevice.applySettings(userDeviceSettings);

        // Set screen device valid channels to match user device to enable view of valid channels
        screenDevice.clearValidChannels();
        screenDevice.validChannels = workingDevice.validChannels;

        renderTrack(document.getElementById("piano-roll"), workingTrack, currentRenderType);

        var secondaryView = document.getElementById("secondary-view");
        renderTrack(secondaryView, workingTrack, "stripRender");
    }
}

function changeRenderType(e) {

    // Keep track of current render type so if user changes device then the
    // render they are looking at stays the same
    currentRenderType = e.target.id;
    renderTrack(document.getElementById("piano-roll"), workingTrack, e.target.id);

}

function changeLongNoteValue(){
    showLongNotes = document.getElementById('show-long-notes').checked;
    console.log(showLongNotes);

    renderTrack(document.getElementById("piano-roll"), workingTrack, currentRenderType);

    var secondaryView = document.getElementById("secondary-view");
    renderTrack(secondaryView, workingTrack, "stripRender");
}

// Testing and dev experiments
function testChannelChange() {

    var channelNumber = parseInt(document.getElementById('channel-number').value);
    var channelName = document.getElementById('channel-name').value;

    console.log("testChannelChange: channelNumber " + channelNumber + " channelName " + channelName);

    workingTrack.setChannelName(channelNumber, channelName);
}




