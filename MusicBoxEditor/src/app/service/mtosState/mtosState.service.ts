import { Injectable } from '@angular/core';


export interface IHeader {
    PPQ?: number;
    bpm?: number;
    timeSignature?: number[];
}

export interface INote {
    name?: string;
    midi?: number;
    time?: number;
    velocity?: number;
    duration?: number;
}

export interface ITrack {
     duration?: number;
    name?: string;
    notes?: INote[];
    controlChanges?: any;
    instrumentNumber?: number;
}


@Injectable()
export class MtosStateService {

    public header: IHeader;
    public tracks: ITrack[];
    public selectedTrack: ITrack;
    public selectedNote: INote;

    constructor() { }

    setHeader(header: IHeader){
        this.header = header;
    }

    setTracks(tracks: ITrack[]){
        this.tracks = tracks;
    }

    selectTrack(index: number){
        if(index < 0 || index >= this.tracks.length){
            console.log('selectTrack: invalid track index.');
            return;
        }

        this.selectedTrack = this.tracks[index];
        this.selectedNote = false;
    }

    selectNote(index: number){
        if(index < 0 || index >= this.selectedTrack.notes.length){
            console.log('selectNote: invalid note index.');
            return;
        }

        this.selectedNote = this.selectedTrack.notes[index];
    }
}