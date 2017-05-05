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
export class AppComponent {
    logger: Logger;

    //track: ITrack = { notes: [] };

    projectName: string;

    header: IHeader;
    notes: INote[];

    scaleTypeOptions = ['Custom']; //['Full', 'Minor', 'Custom'];
    selectedScaleType: string = this.scaleTypeOptions[0];
    noteScale: number[] = [];
    scaleStart: number;

    noteTypes = ['Circle', 'Rectangle']
    selectedNoteType: any = this.noteTypes[0];
    numNotes: number = 20;
    noteDistance: number = 3;
    noteHeight: number = 3;
    noteWidth: number = 3;

    trackStart: number = 50;
    trackShift: number = 50;
    trackPadding: number = 6.35;

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
        this.init();


    }

    init() {
        this.setState(null);
        console.log(this);
    }

    initNoteTable() {
        var noteLetter = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for (let i = 0; i < 128; i++) {
            var octave = Math.floor(i / 12) - 2;
            var note = noteLetter[i % 12];
            this.noteTable[i] = octave + note;
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
            selectedScaleType: this.selectedScaleType,
            scaleStart: this.noteScale,
            startNote: this.scaleStart,
            selectedNoteType: this.selectedNoteType,
            numNotes: this.numNotes,
            noteDistance: this.noteDistance,
            noteHeight: this.noteHeight,
            noteWidth: this.noteWidth,
            trackStart: this.trackStart,
            trackShift: this.trackShift,
            trackPadding: this.trackPadding,
            trackPartLength: this.trackPartLength,
            trackLength: this.trackLength
        }
        return state;
    }

    setState(state) {

        if (!state) {//if no state -> setDefaults
            state = {};
        }

        this.projectName = state.projectName || 'New Project';
        this.header = state.header || {};
        this.notes = state.notes || [];
        this.numNotes = state.numNotes || 20;
        this.selectedScaleType = state.selectedScaleType || 'Custom';
        this.scaleStart = state.scaleStart || 36;
        this.noteScale = state.noteScale || this.generateNoteScale();
        this.selectedNoteType = state.selectedNoteType || 'Circle';
        this.noteDistance = state.noteDistance || 3;
        this.noteHeight = state.noteHeight || 3;
        this.noteWidth = state.noteWidth || 3;
        this.trackStart = state.trackStart || 50;
        this.trackShift = state.trackShift || 50;
        this.trackPadding = state.trackPadding || 6.35;
        this.trackPartLength = state.trackPartLength || 200;
        this.trackLength = state.trackLength || 200;

        this.updateNotes();
    }


    onChangeImportMidi(event: any) {
        var files = event.target.files;
        if (files.length > 0) {
            var file = files[0];
            this.parseFile(file);
        }
    }

    onClickSaveProject() {
        console.log(this.getState());
    }

    onChangeNumNotes(newValue) {
        this.numNotes = newValue;

        this.updateNotes();
    }

    onChangeScaleType(newValue) {
        this.selectedScaleType = newValue;

        this.updateNotes();
    }

    onChangeScaleStart(newValue) {
        this.scaleStart = newValue;
        this.noteScale = this.generateNoteScale();
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
        var svgString = this.generateSvg();

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

    isCircleNoteType(): boolean {
        if (this.selectedNoteType === this.noteTypes[0]) {
            return true;
        }
        return false;
    }

    generateNoteScale(): number[] {
        var result: number[] = [];

        for (let i = 0; result.length < this.numNotes; i++) {
            var midi = this.scaleStart + i;
            if (this.noteTable[midi].indexOf('#') != -1) {
                continue;
            }

            result.push(midi);
        }

        return result;
    }

    updateNotes() {

        var numTrackParts = this.getNumTrackParts();
        this.trackParts = []; //Angular 2 ng-for trick.
        for (let i = 0; i < numTrackParts; i++) {
            this.trackParts.push(i);
        }

        this.verticalLines = []; //Angular 2 ng-for trick.
        this.numVerticalLines = Math.floor(this.trackLength / 4) + 1;
        for (let i = 0; i < this.numVerticalLines; i++) {
            this.verticalLines.push(i);
        }
    }

    getPaperHeight(): number{
        return this.trackPadding * 2 + (this.noteScale.length - 1) * this.noteDistance;
    }

    getTrackHeight(): number{
        return (this.numNotes - 1) * this.noteDistance;
    }

    getNumTrackParts(): number{
        if(this.trackLength <= 0){
            return 1;
        }
        return Math.ceil(this.trackLength / this.trackPartLength);
    }

    showTrack(): boolean {
        if (!this.notes) {
            return false;
        }
        return true;
    }

    //Scale
    getScaleWidth() {
        return '10mm';
    }

    getScaleHeight() {
        return this.getPaperHeight() + 20 + 'mm';
    }

    getScaleViewBox() {
        return '0 -10 ' + 10 + ' ' + (this.getPaperHeight() + 20);
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

    //ViewBox
    getViewBoxWidth() {
        var trackLength = this.getNumTrackParts() * this.trackPartLength;
        return trackLength + this.trackStart + this.trackShift + 20 + 'mm';
    }

    getViewBoxHeight() {
        return this.getPaperHeight() + 20 + 'mm';
    }

    getTrackViewBox() {
        var trackLength = this.getNumTrackParts() * this.trackPartLength;

        return (-this.trackStart - 10) + ' -10 ' + (trackLength + this.trackStart + this.trackShift + 20) + ' ' + (this.getPaperHeight() + 20);
    }

    //Text
    getTextY(midi: number): number {
        return this.getPaperHeight() - this.trackPadding - (this.getNoteYOffset(midi) * this.noteDistance) + 1;
    }

    //Note Lines
    getNoteLineY(midi: number): number {
        return this.getPaperHeight() - this.trackPadding - (this.getNoteYOffset(midi) * this.noteDistance);
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
        return this.getTrackHeight() + this.trackPadding;
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
            return this.getPaperHeight() - this.trackPadding - (this.getNoteYOffset(note.midi) * this.noteDistance);
        }
        return this.getPaperHeight() - this.trackPadding - (this.getNoteYOffset(note.midi) * this.noteDistance) - (this.noteHeight / 2);
    }

    getNoteYOffset(midi: number) {
        var index = this.noteScale.indexOf(midi);
        return index;
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
        return this.getPaperHeight();
    }

    getTrackPartPath(n: number): string {
        var extra = 0;
        if (n == 0) {
            extra -= this.trackStart;
        }


        var s = 'M' + (extra + this.trackPartLength * n) + ',' + this.getPaperHeight();
        s += 'L' + (this.trackPartLength * (n + 1)) + ',' + this.getPaperHeight();
        s += ' ' + (this.trackPartLength * (n + 1) + this.trackShift) + ',' + 0;
        s += ' ' + (extra + this.trackPartLength * n + this.trackShift) + ',' + 0;
        s += 'z';

        return s;
    }

    getTrackPartPathDivider(n: number): string {
        var delta = 40;

        var s = 'M' + this.trackPartLength * (n + 1) + ',' + this.getPaperHeight();
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
}


