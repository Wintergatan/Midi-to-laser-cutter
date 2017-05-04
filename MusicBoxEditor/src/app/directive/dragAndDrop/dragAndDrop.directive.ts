import { Directive, ElementRef, HostListener, Input, HostBinding } from '@angular/core';
import { DragAndDropService } from "./dragAndDrop.service";

@Directive({
    selector: '[dragstart]'
})
export class DragStartDirective {
    
    @Input('dragstart') private dragStartCallback: (DragEvent, DragAndDropService)=>void;
    
    @HostBinding('draggable') hostDraggable = "true"; 

    constructor(private dragAndDropService: DragAndDropService) {}

    @HostListener('dragstart', ['$event']) 
    onDragStart(event: DragEvent) {
        event.dataTransfer.effectAllowed = 'all';

        this.dragAndDropService.clear();
        this.dragStartCallback(event, this.dragAndDropService);

    }
}

@Directive({
    selector: '[drag-success][drag-error]'
})
export class DragSuccessDirective {

    @Input('drag-success') private dragSuccessCallback: (DragEvent, DragAndDropService)=>void;
    @Input('drag-error') private dragErrorCallback: (DragEvent, DragAndDropService)=>void;

    constructor(private dragAndDropService: DragAndDropService) {}

    @HostListener('dragend', ['$event']) 
    onDropSuccess(event: DragEvent) {

        if(this.dragAndDropService.getSuccess() === true){
            this.dragSuccessCallback(event, this.dragAndDropService);
        }else{
            this.dragErrorCallback(event, this.dragAndDropService);
        }

        this.dragAndDropService.clear();

    }
}

@Directive({
    selector: '[dragover]'
})
export class DragOverDirective {

    @Input('dragover') private dragoverCallback: (DragEvent, DragAndDropService)=>boolean;

    constructor(private dragAndDropService: DragAndDropService) {}

    @HostListener('dragover', ['$event']) 
    onDropOver(event: DragEvent) {
        event.dataTransfer.dropEffect = 'move';
        
        if(this.dragoverCallback){
            this.dragoverCallback(event, this.dragAndDropService);
        }
        
        event.preventDefault();
    }
}

@Directive({
    selector: '[drop]'
})
export class DropDirective {

    @Input('drop') private dropCallback: (DragEvent, DragAndDropService)=>boolean;

    constructor(private dragAndDropService: DragAndDropService) {}

    @HostListener('drop', ['$event']) 
    onDrop(event: DragEvent) {

        if(this.dropCallback(event, this.dragAndDropService)){
            this.dragAndDropService.setSuccess(true);
        }

        event.preventDefault();
    }
}