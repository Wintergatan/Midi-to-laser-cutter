
// Global variables and constants
var noteNames = ["C", "Db/C#", "D", "Eb/D#", "F", "Gb/F#", "G", "Ab/G#", "A", "B"];

// Testing variables
var GI20ValidChannels = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93];
var templatesDirectory = "../templates/";


var workingTrack = undefined;
var screenDevice = undefined;
var workingDevice = undefined;

var renderType = "screen"; // temp way of keeping track what render type to use


// Utility functions
function compare(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

function noteNumberToNoteName(noteNumber, showOctave) {

    // TODO allow french note names and drum instrument names

    var noteNameIndex = noteNumber % 10;

    // TODO check logic below for calculating octave number
    var octave = (Math.floor(noteNumber / 12)).toString();

    var noteName = noteNames[noteNameIndex];

    if (showOctave == true) {
        noteName += octave;
    }

    return noteName;
}



// MidiTrack
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

        var channelName = noteNumberToNoteName(i);
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


// MidiEvent
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


// MidiChannel
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

// Devices
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

    // Array to store ordered list of channel offsets from bottom margin
    this.channelOffsets = [];

    // Array to store channel numbers for valid channels ie note numbers
    this.validChannels = [];

    // Array to hold description for each channel
    this.channelDescriptions = [];

}

Device.prototype.setChannelOffset = function (channelNumber, offset) {

    for (var i = 0; i < this.validChannels.length; i++) {
        if (this.validChannels[i] == channelNumber) {
            this.channelOffsets[i] = offset;
        }
    }
    // Any other device stuff need to be recalculated????

};

Device.prototype.isValidDeviceChannel = function (channelNumber) {

    return this.validChannels.indexOf(channelNumber) > -1;

};

Device.prototype.setDeviceChannelValidity = function (channelNumber, isValid) { // array of

    var channelAlreadyValid = this.isValidDeviceChannel(channelNumber);

    if (channelAlreadyValid) {

        // ... and we want to set it to invalid
        if (isValid == false) {
            // Remove it from array
            var index = this.validChannels.indexOf(channelNumber);
            this.validChannels.splice(index, 1);

        } else {
            return;
        }

    } else {
        // not already valid
        if (isValid) {
            // add it to array
            this.validChannels.push(channelNumber);
        }
    }

};

Device.prototype.clearValidChannels = function(){
  this.validChannels = [];
};


// Interface

function noteClick(e) {

    var output = document.getElementById('output');

    console.dir(e.target);
    //var noteData = e.target.getAttribute('data-notedata');
    //var noteNumber = e.target.getAttribute('data-notenumber');

    //var channelName = workingTrack.getChannelName(noteNumber);
    //output.innerHTML = noteData + " " + channelName;
}

function svgNoteClick(e) {
    var noteData = e.target.getAttribute('mididata:notedata');
    var outputPara = document.getElementById("output");
    outputPara.innerHTML = noteData;
}

function clearRender(elem) {
    if (elem.hasChildNodes) {
        while (elem.childNodes.length >= 1) {
            elem.removeChild(elem.firstChild);
        }
    }
}

// Temporary helper function
function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
}


function renderTrack(elem, track, device) {

    clearRender(elem);

    // TODO
    // -decide whether or not to use a library for SVG rendering
    // -get topmost and bottommost element with events centre vertical scroll between them
    // -render track headers - notes, channel names, (toggle validity, double-click-edit)


    var minimumDistanceBetweenNotes = device.minDistBetweenNotes;

    // TODO figure out what this does...
    //var paperSpeed = device.paperSpeed;
    var paperSpeed = device.minDistBetweenNotes / track.shortestDeltaT;

    // Temporary render function for testing
    // This will be replaced by code that builds a Maker.js model

    var channels = track.channels;
    var maxX = 0;  // to set final width space for display


    var minY = 2000;
    var maxY = 0;
    var midY = 1000;

    if (renderType == "screen") {

        var svgPianoRoll = getNode('svg');
        svgPianoRoll.setAttribute('id', 'svg-piano-roll');
        svgPianoRoll.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:mididata", "xmlns=http://yuleblinker.com/midimusicbox");
        svgPianoRoll.setAttribute('viewbox', '0 0 3000 2000');
        svgPianoRoll.setAttribute('width', '3000px');
        svgPianoRoll.setAttribute('height', '2000px');


        for (var i = 0; i < channels.length; i++) {

            var channel = channels[i];
            var events = channels[i].events;
            var channelName = channels[i].channelName;

            var svgChannelId = "channel_" + i;
            var svgChannel = getNode('g');
            svgChannel.setAttribute('mididata:channel', i);
            svgChannel.setAttribute('x', '0');
            svgChannel.setAttribute('y', '0');
            svgChannel.setAttribute('width', '3000px');
            svgChannel.setAttribute('height', screenDevice.channelHeight + "px");

            var channelClass = 'svg-channel';
            // Set class based on validity of channel
            if (screenDevice.isValidDeviceChannel(i)) {
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

                    var noteData = evt.noteNumber + "_" + channelName + "_" + evt.noteAction + "_" + evt.tick;

                    var evtXPos = (evt.tick * paperSpeed);  // scale this to units we want e.g pixels or mm

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
                    if(channelY < minY){
                        minY = channelY;
                    }
                    if(channelY > maxY){
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

        console.log("Minimum Y: " + minY + " Maximum Y: " + maxY + " Middle Y: " + midY);

    }

    if (renderType == "screenCollapsed") {

        var numValidChannels = screenDevice.validChannels.length;
        var pianoRollHeight = numValidChannels * screenDevice.channelHeight;

        var svgPianoRoll = getNode('svg');
        svgPianoRoll.setAttribute('id', 'svg-piano-roll');
        svgPianoRoll.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:mididata", "xmlns=http://yuleblinker.com/midimusicbox");
        svgPianoRoll.setAttribute('viewbox', '0 0 3000 ' + pianoRollHeight);
        svgPianoRoll.setAttribute('width', '3000px');
        svgPianoRoll.setAttribute('height', pianoRollHeight + 'px');

        var channelsProcessed = 0;

        for (var i = 0; i < channels.length; i++) {

            if (screenDevice.isValidDeviceChannel(i)) {

                console.log("valid channel" + screenDevice.isValidDeviceChannel(i));

                // Only render valid device channels

                var channel = channels[i];
                var events = channels[i].events;
                var channelName = channels[i].channelName;

                var svgChannelId = "channel_" + i;
                var svgChannel = getNode('g');
                svgChannel.setAttribute('mididata:channel', i);
                svgChannel.setAttribute('x', '0');
                svgChannel.setAttribute('y', '0');
                svgChannel.setAttribute('width', '3000px');
                svgChannel.setAttribute('height', screenDevice.channelHeight + "px");

                var channelClass = 'svg-channel';
                // Set class based on validity of channel
                if (screenDevice.isValidDeviceChannel(i)) {
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

                        var evtXPos = (evt.tick * paperSpeed);  // scale this to units we want e.g pixels or mm

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

                        svgChannel.appendChild(svgEvent);

                    }

                }


                svgPianoRoll.appendChild(svgChannel);
                channelsProcessed++;
            }

            elem.appendChild(svgPianoRoll);
        }

    }

    if (renderType == "strip") {

        if(workingDevice == undefined){
            workingDevice = new Device("screen");
            initializeScreenDevice(workingDevice);
        }

        var units = "mm";

        if(workingDevice["deviceName"] == "screen"){
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

        for (var i = 0; i < channels.length; i++) {

            if (device.isValidDeviceChannel(i)) {

                // Only render valid device channels

                var channel = channels[i];
                var events = channels[i].events;
                var channelName = channels[i].channelName;

                var svgChannelId = "channel_" + i;
                var svgChannel = getNode('g');
                svgChannel.setAttribute('mididata:channel', i);
                svgChannel.setAttribute('x', '0');
                svgChannel.setAttribute('y', '0');
                svgChannel.setAttribute('width', '3000' + units);  // TODO figure out width from device and events
                svgChannel.setAttribute('height', workingDevice.channelHeight + units); // TODO deal with mm vs pixels

                var channelClass = 'svg-channel strip';

                var channelY = ((channelsProcessed + 1) * workingDevice.channelHeight) + workingDevice.bottomPadding;
                if (units == "mm"){
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

                        svgChannel.appendChild(svgEvent);

                    }

                }


                svgPianoRoll.appendChild(svgChannel);
                channelsProcessed++;
            }



            elem.appendChild(svgPianoRoll);
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

    if (renderType == "page") {

    }

    if (renderType == "screenOld") {

        for (var i = 0; i < channels.length; i++) {

            var htmlChannel = document.createElement('div');

            htmlChannel.setAttribute('id', 'channel_' + i);

            var channelClass = 'channel';
            // Set class based on validity of channel
            if (device.isValidDeviceChannel(i)) {
                channelClass += " valid-channel";
            } else {
                channelClass += " invalid-channel";
            }

            htmlChannel.setAttribute('class', channelClass);

            var events = channels[i].events;
            var channelName = channels[i].channelName;

            for (var j = 0; j < events.length; j++) {

                var evt = events[j];

                if (evt.noteAction == "on") {

                    var noteData = evt.noteNumber + "_" + channelName + "_" + evt.noteAction + "_" + evt.tick;

                    var htmlEvent = document.createElement('div');
                    htmlEvent.setAttribute('data-notedata', noteData);
                    htmlEvent.setAttribute('data-notenumber', evt.noteNumber);
                    htmlEvent.setAttribute('class', 'event-dot');

                    var evtXPos = (evt.tick * paperSpeed);  // scale this to units we want e.g pixels or mm

                    // Add a bit of space after - maybe get from device
                    if (evtXPos > maxX) {
                        maxX = evtXPos + device.rightPadding;
                    }

                    var positionStyle = "left:" + evtXPos + "px;";
                    htmlEvent.setAttribute('style', positionStyle);

                    htmlEvent.addEventListener('click', noteClick);

                    htmlChannel.appendChild(htmlEvent);
                }


            }

            elem.appendChild(htmlChannel);
        }

        elem.setAttribute('style', 'width:' + maxX + "px;");
    }

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

        var midiData = MIDIParser.Uint8(new Uint8Array(e.target.result));

        workingTrack = new MidiTrack();
        workingTrack.setEvents(midiData, false);
        workingTrack.eventsToChannels(workingTrack.events, true);

        renderTrack(document.getElementById('piano-roll'), workingTrack, screenDevice);

        //prepareFiles();
    };

    return true;
}

function applySettingsToDevice(device, deviceSetting){

    for (var property in deviceSetting) {
        if (deviceSetting.hasOwnProperty(property)) {
            //console.log(property);
            device[property] = deviceSetting[property];
        }
    }
}

function setDevice(){

    var deviceSelect = document.getElementById('device-select');
    var deviceChoice = deviceSelect.options[deviceSelect.selectedIndex].value;

    // Use choice to select a known device
    if (deviceChoice != "none"){

        var userDevice = knownDevices[deviceChoice];

        if(workingDevice == undefined){
            workingDevice = new Device(userDevice["deviceName"]);
        }

        // Copy properties of known device to working device
        applySettingsToDevice(workingDevice, userDevice);


        // Set screen device valid channels to match user device to enable view of valid channels
        screenDevice.clearValidChannels();
        screenDevice.validChannels = workingDevice.validChannels;

        renderTrack(document.getElementById("piano-roll"), workingTrack, workingDevice);
    }


}


function testChannelChange() {

    var channelNumber = parseInt(document.getElementById('channel-number').value);
    var channelName = document.getElementById('channel-name').value;

    console.log("testChannelChange: channelNumber " + channelNumber + " channelName " + channelName);

    workingTrack.setChannelName(channelNumber, channelName);
}

function initializeScreenDevice(device) {

    var shortestDeltaT = workingTrack.shortestDeltaT;

    device.minDistBetweenNotes = 15;
    device.paperSpeed = device.minDistBetweenNotes / shortestDeltaT;
    device.channelHeight = 15;
    device.eventHeight = device.channelHeight;
    device.eventWidth = 15;
    device.bottomPadding = 20;
    device.topPadding = 20;

    // Set all offsets ???? is this necessary for screen device??
    for (var j = 0; j < 128; j++) {
        device.channelOffsets.push(20 * j);
    }

    // All channels initially valid
    for (var i = 0; i < 128; i++) {
        device.setDeviceChannelValidity(i, true);
    }

}



function changeRenderType(e) {

    var viewBtnId = e.target.id;
    if(viewBtnId == "screen-btn"){
        renderType = "screen";
    }
    if(viewBtnId == "screen-collapsed-btn"){
        renderType = "screenCollapsed";
    }
    if (viewBtnId == "strip-btn"){
        renderType = "strip";
    }
    if(viewBtnId == "page-btn"){
        renderType = "page";
    }

    renderTrack(document.getElementById("piano-roll"), workingTrack, screenDevice);

}


