import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { LogService, Logger } from './service/log/log.service';

import * as MidiConvert from "midiconvert";
import { IHeader, ITrack, INote } from "./service/mtosState/mtosState.module";
import { ContextMenuService } from "./ui/contextMenu/contextMenu.module";
import { DialogService, IDialogSelect } from "./ui/dialog/dialog.module";
import { ISubMenuComponentOptions } from "./ui/subMenu/subMenu.module";

import * as JSZip from "jszip";

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
    }

    initNoteTable() {
        var noteLetter = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for (let i = 0; i < 128; i++) {
            var octave = Math.floor(i / 12) - 2;
            var note = noteLetter[i % 12];
            this.noteTable[i] = octave + note;
        }
    }

    getState() {
        var state = {
            projectName: this.projectName,
            header: this.header,
            notes: this.notes,
            selectedScaleType: this.selectedScaleType,
            noteScale: this.noteScale,
            scaleStart: this.scaleStart,
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

        if (state === null || state === undefined) {//if no state -> setDefaults
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


    onChangeImportMidi(event: any) {
        var files = event.target.files;
        if (files.length > 0) {
            var file = files[0];
            this.parseFile(file);
        }
    }

    onClickLoadProject() {
        var element = <HTMLInputElement>document.getElementById('file-input');
        element.accept = 'application/json';
        element.onchange = (event: any) => {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.setState(JSON.parse(event.target.result));
            };
            reader.readAsText(event.path[0].files[0]);
        };

        element.click();
    }

    onClickSaveProject() {
        var state = this.getState();
        var stateAsJson = JSON.stringify(state);

        var filename = this.projectName + '.json';
        var blob = new Blob([stateAsJson], { type: 'application/json' });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var elem = <HTMLAnchorElement>document.getElementById('file-output');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            elem.click();
        }
    }

    onChangeNumNotes(newValue) {
        this.numNotes = newValue;
        this.noteScale = this.generateNoteScale();
        this.updateNotes();
    }

    onChangeScaleType(newValue) {
        this.selectedScaleType = newValue;
        this.noteScale = this.generateNoteScale();
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
        var element = <HTMLInputElement>document.getElementById('file-input');
        element.accept = 'audio/midi';
        element.onchange = (event) => {
            this.onChangeImportMidi(event);
        }

        element.click();
    }

    onClickDownload() {
        var svgString = this.generateSvg();
        var filename = this.projectName + '.zip';

        var useDownloadAsZip = true;
        if (useDownloadAsZip) {

            var svgStringArray = this.splitSvg(svgString);
            var zip = new JSZip();
            for (let i = 0; i < svgStringArray.length; i++) {
                zip.file(this.projectName + i + '.svg', svgStringArray[i]);
            } 

            zip.generateAsync({ type: "blob", compression: 'DEFLATE'})
                .then(function (content) {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob(content, filename);
                    }
                    else {
                        var element = <HTMLAnchorElement>document.getElementById('file-output');
                        element.href = window.URL.createObjectURL(content);
                        element.download = filename;
                        element.click();
                    }
                });

        } else {

            var blob = new Blob([svgString], { type: 'image/svg+xml' });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else {
                var elem = <HTMLAnchorElement>document.getElementById('file-output');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = filename;
                elem.click();
            }

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

    splitSvg(svgAsString: string): string[] {
        var element = this.stringToElement(svgAsString);
        var numParts = this.getChildById('parts', element).children.length;

        var partsAsStringArray = [];

        for (let i = 0; i < numParts; i++) {

            var clone = <HTMLElement>element.cloneNode(true);

            var partGroup = this.getChildById('parts', clone);
            var idGroup = this.getChildById('track-part-id', clone);
            var noteGroup = this.getChildById('notes', clone);

            var part = <SVGPathElement>partGroup.children[i];
            var id = <SVGTextElement>idGroup.children[i];
            var partBBox = this.getPathBBox(part);

            //width="2320mm" height="89.7mm" viewBox="-60 -10 2320 89.7"
            clone.setAttribute('width', (partBBox.width + 5) + 'mm');
            clone.setAttribute('height', (partBBox.height + 5) + 'mm');
            clone.setAttribute('viewBox', (partBBox.x - 5) + ' ' + (partBBox.y - 5) + ' ' + (partBBox.width + 10) + ' ' + (partBBox.height + 10));

            for (let j = 0; j < noteGroup.children.length; j++) {
                var note = <SVGEllipseElement | SVGRectElement>noteGroup.children[j];
                var noteBBox;
                if(note.tagName === 'ellipse'){
                    noteBBox = this.getEllipseBBox(<SVGEllipseElement>note);
                }else{
                    noteBBox = this.getRectBBox(<SVGRectElement>note);
                }

                if (!this.isIntersecting(partBBox, noteBBox)) {
                    noteGroup.removeChild(note);
                    j--;
                }
            }

            while (partGroup.firstChild) {
                partGroup.removeChild(partGroup.firstChild);
            }
            partGroup.appendChild(part);

            while (idGroup.firstChild) {
                idGroup.removeChild(idGroup.firstChild);
            }
            idGroup.appendChild(id);


            partsAsStringArray.push(clone.outerHTML.toString());
        }

        return partsAsStringArray;
    }

    getEllipseBBox(a: SVGEllipseElement): SVGRect {
        var cx = parseFloat(a.getAttribute('cx'));
        var cy = parseFloat(a.getAttribute('cy'));
        var rx = parseFloat(a.getAttribute('rx'));
        var ry = parseFloat(a.getAttribute('ry'));

        return <SVGRect>{
            x: cx - rx,
            y: cy - ry,
            width: rx + rx,
            height: ry + ry
        };
    }

    getRectBBox(a: SVGRectElement): SVGRect {
        var x = parseFloat(a.getAttribute('x'));
        var y = parseFloat(a.getAttribute('y'));
        var width = parseFloat(a.getAttribute('width'));
        var height = parseFloat(a.getAttribute('height'));

        return <SVGRect>{
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    getPathBBox(a: SVGPathElement): SVGRect {
        const regex = /([+-]?(?:[0-9]*\.)?[0-9]+),([+-]?(?:[0-9]*\.)?[0-9]+)/g;
        var d = a.getAttribute('d');
        var match;

        var minX, maxX, minY, maxY;


        while ((match = regex.exec(d)) !== null) {
            var x = parseFloat(match[1]);
            var y = parseFloat(match[2]);
            if(minX === undefined){
                minX = x;
                maxX = x;
                minY = y;
                maxY = y;
                continue;
            }

            if(x < minX){
                minX = x;
            }
            if(x > maxX){
                maxX = x;
            }

            if(y < minY){
                minY = y;
            }
            if(y > maxY){
                maxY = y;
            }
        }

        return {
            x: minX, 
            y: minY, 
            width: maxX - minX, 
            height: maxY - minY
        };
    }

    isIntersecting(a: SVGRect, b: SVGRect): boolean {
        //console.log(a, b);
        if (b.x > a.x + a.width || b.x + b.width < a.x ||
            b.y > a.y + a.height || b.y + b.height < a.y) {
            return false;
        }
        return true;
    }

    stringToElement(htmlAsString: string): HTMLElement {
        var div = document.createElement('div');
        div.innerHTML = htmlAsString;
        return <HTMLElement>div.firstChild;
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

    getPaperHeight(): number {
        return this.trackPadding * 2 + (this.noteScale.length - 1) * this.noteDistance;
    }

    getTrackHeight(): number {
        return (this.numNotes - 1) * this.noteDistance;
    }

    getNumTrackParts(): number {
        if (this.trackLength <= 0) {
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


