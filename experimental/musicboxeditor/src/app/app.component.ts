import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { LogService, Logger } from './service/log/log.service';

import * as MidiConvert from "midiconvert";
import { IHeader, ITrack, INote } from "./service/mtosState/mtosState.module";
import { ContextMenuService } from "./ui/contextMenu/contextMenu.module";
import { DialogService, IDialogSelect } from "./ui/dialog/dialog.module";
import { ISubMenuComponentOptions } from "./ui/subMenu/subMenu.module";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    logger: Logger;

    //track: ITrack = { notes: [] };

    projectName: string = 'New Project';

    header: IHeader;
    notes: INote[] = [];

    scaleTypeOptions = ['Custom']; //['Full', 'Minor', 'Custom'];
    scaleType: string = this.scaleTypeOptions[0]; //rename
    noteScale: number[] = [];
    startNote: number = 36; //rename

    noteTypes = ['Circle', 'Rectangle']
    selectedNoteType: any = this.noteTypes[0];
    numNotes: number = 20;
    noteDistance: number = 3;
    noteHeight: number = 3;
    noteWidth: number = 3;

    trackStart: number = 50;
    trackShift: number = 50;
    paperHeight: number = 69.7; //remove? (calculate)
    trackHeight: number = 57;   //remove? (calculate)
    trackPadding: number = 6.35;

    numTrackParts: number = 1; //remove? (calculate)
    trackParts: number[];
    trackPartLength: number = 200;
    trackLength: number = 200;

    numVerticalLines: number = 200 / 4;
    verticalLines: number[] = [];

    noteTable = {};

    mainMenuOptions: ISubMenuComponentOptions;

    constructor(private contextMenuService: ContextMenuService, private dialogService: DialogService) {

        window['state'] = this; //Debug only;

        this.mainMenuOptions = {
            onInit: () => { },
            disableBackground: true,
            disableText: false,
            iconSize: 'big',
            buttons: [{
                text: 'Help',
                iconClass: 'int-icon-info-circle',
                callback: () => {
                    this.dialogService.openMessage('Help',
                        `This application is under development. 
Expect bugs and incomplete features.

Missing features:
- Add notes.
- Move notes.
- Download track parts in individual files.
- Save and load project.

Getting started:
Import one or more midi files.
Invalid notes are marked in red.
Hover over them for more details.
Click on the channel to change it (left side).
Or right click on note to delete it.
`);
                }
            }]
        };

        this.initNoteTable();
        this.setDefault();



    }

    //TODO: add note
    //TODO: move note
    //TODO: add custom Scale (WIP)
    //TODO: From midi to note(c, d, e, ....)
    //TODO: multiplart download
    //TODO: save project

    ngOnInit(): void {

    }

    onChangeImportMidi(event: any) {
        var files = event.target.files;
        if (files.length > 0) {
            var file = files[0];
            this.parseFile(file);
        }
    }

    parseFile(file) {
        var reader = new FileReader();
        reader.onload = (event: any) => {

            var data = <any>MidiConvert.parse(event.target.result);
            if (!data || !data.tracks || data.tracks.length === 0) {
                return;
            }

            if (data.tracks.length > 1) {

                var options = [];
                for (let i = 0; i < data.tracks.length; i++) {
                    var t = data.tracks[i];
                    options.push({
                        key: i,
                        value: t.name
                    });
                }

                var select: IDialogSelect = {
                    text: 'Select track',
                    selected: options[0].key,
                    options: options
                }

                this.dialogService.openSelect('Multiple tracks in midi file', null, select, () => {
                    this.importNotes(data.tracks[select.selected].notes);
                    this.updateNotes();
                });

            } else {
                this.importNotes(data.tracks[0].notes);
                this.updateNotes();
            }


        };
        reader.readAsBinaryString(file);
    }

    importNotes(newNotes: INote[]) {

        for (let i = 0; i < newNotes.length; i++) {
            this.notes.push(newNotes[i]);
        }

        this.sortNotes();

        this.trackLength = this.notes[this.notes.length - 1].time * 16;
    }

    sortNotes() {
        this.notes.sort(function (a, b) {
            var aValue = a.time;
            var bValue = b.time;
            if (aValue < bValue) {
                return -1;
            }
            if (aValue > bValue) {
                return 1;
            }
            return 0;
        });


    }

    getState() {
        var state = {
            projectName: this.projectName,
            header: this.header,
            notes: this.notes,
            scaleType: this.scaleType,
            noteScale: this.noteScale,
            startNote: this.startNote,
            selectedNoteType: this.selectedNoteType,
            numNotes: this.numNotes,
            noteDistance: this.noteDistance,
            noteHeight: this.noteHeight,
            noteWidth: this.noteWidth,
            trackStart: this.trackStart,
            trackShift: this.trackShift,
            paperHeight: this.paperHeight,
            trackHeight: this.trackHeight,
            trackPadding: this.trackPadding,
            numTrackParts: this.numTrackParts,
            trackPartLength: this.trackPartLength,
            trackLength: this.trackLength
        }
        return state;
    }

    setState(state) {
        //TODO: if undefined -> set default
        this.projectName = state.projectName;
        this.header = state.header;
        this.notes = state.notes;
        this.scaleType = state.scaleType;
        this.noteScale = state.noteScale;
        this.startNote = state.startNote;
        this.selectedNoteType = state.selectedNoteType;
        this.numNotes = state.numNotes;
        this.noteDistance = state.noteDistance;
        this.noteHeight = state.noteHeight;
        this.noteWidth = state.noteWidth;
        this.trackStart = state.trackStart;
        this.trackShift = state.trackShift;
        this.paperHeight = state.paperHeight;
        this.trackHeight = state.trackHeight;
        this.trackPadding = state.trackPadding;
        this.numTrackParts = state.numTrackParts;
        this.trackPartLength = state.trackPartLength;
        this.trackLength = state.trackLength

        this.updateNotes();
    }


    onClickSaveProject() {
        console.log(this.getState());
    }

    onChangeNumNotes(newValue) {
        this.numNotes = newValue;

        this.updateNotes();
    }

    onChangeScaleType(newValue) {
        this.scaleType = newValue;

        this.updateNotes();
    }

    onChangeStartNote(newValue) {
        this.startNote = newValue;

        this.updateNotes();
    }

    onChangeNoteDistance(newValue) {
        this.noteDistance = newValue;

        this.updateNotes();
    }


    onChangeNoteHeight(newValue) {
        this.noteHeight = newValue;

        this.updateNotes();
    }

    onChangeNoteWidth(newValue) {
        this.noteWidth = newValue;

        this.updateNotes();
    }

    onChangeTrackLength(newValue) {
        this.trackLength = newValue;

        this.updateNotes();
    }

    onChangeTrackPartLength(newValue) {
        this.trackPartLength = newValue;

        this.updateNotes();
    }

    onChangeTrackPadding(newValue) {
        this.trackPadding = newValue;

        this.updateNotes();
    }

    onClickImportMidi() {
        var element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', 'audio/midi');
        element.onchange = (event) => {
            this.onChangeImportMidi(event);
        }

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    onClickDownload() {
        console.log('download clicked');

        var svgString = this.generateSvg();
        //console.log(svgString);

        var filename = this.projectName + '.svg';
        var blob = new Blob([svgString], { type: 'image/svg+xml' });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }

    }

    generateSvg(): string {
        var svg = document.getElementById('musicbox-svg');
        var clone = svg.cloneNode(true);

        //remove guidelines
        var element = this.getChildById('note-lines-group', <Element>clone);
        clone.removeChild(element);
        element = this.getChildById('note-vertical-lines', <Element>clone);
        clone.removeChild(element);
        element = this.getChildById('track-part-divider', <Element>clone);
        clone.removeChild(element);

        var s = (<HTMLElement>clone).outerHTML.toString();

        //remove binding code
        s = s.replace(/<!--((.|\n)*?)-->/g, '');
        s = s.replace(/(_ngcontent(?:.*?)"")/g, '');
        s = s.replace(/(ng-reflect(?:.*?)".*?")/g, '');

        return s;
    }

    getChildById(id: string, element: Element): Element {
        if (!element || !element.children) {
            return null;
        }

        for (let i = 0; i < element.children.length; i++) {
            let n = element.children[i];
            if (!n) {
                continue;
            }
            if (n.id === id) {
                return n;
            }
        }

        return null;
    }

    midiToNote(n: number) {
        return this.noteTable[n];
    }

    showTrack(): boolean {
        if (!this.notes) {
            return false;
        }
        return true;
    }

    isCircleNoteType(): boolean {
        if (this.selectedNoteType === this.noteTypes[0]) {
            return true;
        }
        return false;
    }

    setDefault() {
        this.projectName = 'New Project';

        this.notes = [];

        this.startNote = 36;
        this.numNotes = 20;
        this.noteDistance = 3;
        this.noteWidth = 3;
        this.noteHeight = 3;

        this.trackPadding = 6.35;
        this.trackStart = 50;
        this.trackShift = 50;

        this.trackPartLength = 200;

        this.updateNotes();
    }


    updateNotes() {

        this.noteScale = [];

        for (let i = 0; this.noteScale.length < this.numNotes; i++) {
            var midi = this.startNote + i;
            if (this.noteTable[midi].indexOf('#') != -1) {
                continue;
            }

            this.noteScale.push(midi);
        }

        this.trackHeight = (this.numNotes - 1) * this.noteDistance;
        this.paperHeight = this.trackHeight + (this.trackPadding * 2);

        this.numTrackParts = Math.ceil(this.trackLength / this.trackPartLength);
        this.trackParts = []; //Angular 2 ng-for trick.
        for (let i = 0; i < this.numTrackParts; i++) {
            this.trackParts.push(i);
        }

        this.verticalLines = []; //Angular 2 ng-for trick.
        this.numVerticalLines = Math.floor(this.trackLength / 4) + 1;
        for (let i = 0; i < this.numVerticalLines; i++) {
            this.verticalLines.push(i);
        }
    }

    getNoteYOffset(midi: number) {
        var index = this.noteScale.indexOf(midi);
        return index;
    }

    //Scale
    getScaleWidth() {
        return '10mm';
    }

    getScaleHeight() {
        return this.paperHeight + 20 + 'mm';
    }

    getScaleViewBox() {
        return '0 -10 ' + 10 + ' ' + (this.paperHeight + 20);
    }

    onClickScale(event: MouseEvent, index: number) {
        var options = {
            x: event.clientX,
            y: event.clientY,
            menu: this.generateContextMenu(index)
        }

        this.contextMenuService.openContextMenu(options);

        event.preventDefault();
    }

    generateContextMenu(index: number) {
        var menu = [];
        var test = index.toString();
        for (let n in this.noteTable) {
            var option: any = {
                text: this.noteTable[n],
                callback: () => {
                    var i = this.noteScale.indexOf(index);
                    if (i != -1) {
                        this.noteScale[i] = ~~n;
                    }
                }
            }

            if (n == test) {
                option.icon = 'int-icon-approve';
            }

            menu.push(option);
        }
        return menu;
    }

    onMouseDownScale() {
        this.contextMenuService.closeContextMenu();
    }

    //Track
    getTrackWidth() {
        var trackLength = this.numTrackParts * this.trackPartLength;
        return trackLength + this.trackStart + this.trackShift + 20 + 'mm';
    }

    getTrackHeight() {
        return this.paperHeight + 20 + 'mm';
    }

    getTrackViewBox() {
        var trackLength = this.numTrackParts * this.trackPartLength;

        return (-this.trackStart - 10) + ' -10 ' + (trackLength + this.trackStart + this.trackShift + 20) + ' ' + (this.paperHeight + 20);
    }

    //Text
    getTextY(midi: number): number {
        return this.paperHeight - this.trackPadding - (this.getNoteYOffset(midi) * this.noteDistance) + 1;
    }

    //Note Lines
    getNoteLineY(midi: number): number {
        return this.paperHeight - this.trackPadding - (this.getNoteYOffset(midi) * this.noteDistance);
    }

    getNoteLineLength(): number {
        return this.trackLength;
    }

    getNoteLineColor(midi: number) {
        if (this.noteTable[midi].indexOf('C') != -1) {
            return '#2f61ba';
        }
        return '#93CCEA';
    }

    //Vertical Lines
    getVerticalLineBorder(i: number): string {
        return i % 2 == 0 ? '' : '1.5, 1.5';
    }

    getVerticalLineX(index: number): number {
        return index * 4;
    }

    getVerticalLineY1(): number {
        return this.trackPadding;
    }

    getVerticalLineY2(): number {
        return this.trackHeight + this.trackPadding;
    }

    //Notes
    getNoteX(note: INote): number {
        if (this.isCircleNoteType()) {
            return note.time * 16;
        }
        return note.time * 16 - (this.noteWidth / 2);

    }

    getNoteY(note: INote): number {
        if (this.isCircleNoteType()) {
            return this.paperHeight - this.trackPadding - (this.getNoteYOffset(note.midi) * this.noteDistance);
        }
        return this.paperHeight - this.trackPadding - (this.getNoteYOffset(note.midi) * this.noteDistance) - (this.noteHeight / 2);
    }

    getNoteWidth(): number {
        if (this.isCircleNoteType()) {
            return this.noteWidth / 2;
        }
        return this.noteWidth;
    }

    getNoteHeight(): number {
        if (this.isCircleNoteType()) {
            return this.noteHeight / 2;
        }
        return this.noteHeight;
    }

    getNoteFillColor(note: INote): string {
        if (this.getNoteYOffset(note.midi) === -1) {
            return '#d73c3c';
        }

        return '#fff';
    }

    onClickContextMenu(event: MouseEvent, note) {
        var index = this.notes.indexOf(note);
        if (index != -1) {
            this.notes.splice(index, 1);
        }

        event.preventDefault();
    }

    getHint(note: INote): string {
        return this.noteTable[note.midi];
    }

    //Paper
    getLineAX1(n: number): number {
        return this.trackPartLength * n;
    }

    getLineAX2(n: number): number {
        return this.trackPartLength * (n + 1);
    }

    getLineAY(n: number): number {
        return 0;
    }

    getLineBY(n: number): number {
        return this.paperHeight;
    }

    getTrackPartPath(n: number): string {
        var extra = 0;
        if (n == 0) {
            extra -= this.trackStart;
        }


        var s = 'M' + (extra + this.trackPartLength * n) + ',' + this.paperHeight;
        s += 'L' + (this.trackPartLength * (n + 1)) + ',' + this.paperHeight;
        s += ' ' + (this.trackPartLength * (n + 1) + this.trackShift) + ',' + 0;
        s += ' ' + (extra + this.trackPartLength * n + this.trackShift) + ',' + 0;
        s += 'z';

        return s;
    }

    getTrackPartPathDivider(n: number): string {
        var delta = 40;

        var s = 'M' + this.trackPartLength * (n + 1) + ',' + this.paperHeight;
        s += 'L' + (this.trackPartLength * (n + 1) + this.trackShift) + ',' + 0;

        return s;
    }

    //TrackID
    getTrackIdX(index: number): number {
        if (index === 0) {
            return (this.trackPartLength * index) + 10;
        }
        return this.trackShift + (this.trackPartLength * index) + 10;
    }

    getTrackIdY(index: number): number {
        return 4;
    }

    getTrackId(index: number): string {
        return '' + (index + 1);
    }


    //init
    initNoteTable() {
        var noteLetter = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for (let i = 0; i < 128; i++) {
            var octave = Math.floor(i / 12) - 2;
            var note = noteLetter[i % 12];
            this.noteTable[i] = octave + note;
        }
    }
}


