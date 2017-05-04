import { Injectable } from '@angular/core';

@Injectable()
export class DragAndDropService {

    private success: boolean;
    private data: any;

    constructor() {
        this.data = {};
        this.success = false;
    }

    clear() {
        this.data = {};
        this.success = false;
    }

    setData(type: string, data: any) {
        this.data[type] = data;
    }

    getData(type: string): any | null {
        if (this.data[type]) {
            return this.data[type];
        }
        return null;
    }

    setSuccess(success: boolean){
        this.success = true;
    }

    getSuccess():boolean{
        return this.success;
    }
}
