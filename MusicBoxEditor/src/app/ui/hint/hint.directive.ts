import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { HintService } from './hint.service';


@Directive({
    selector: '[hint]'
})
export class Hint {
    @Input('hint') private hint: string;

    private timeout;

    constructor(private hintService: HintService) {}


    private openHint(bbox: ClientRect) {
        if (this.hintService) {
            this.hintService.open(this.hint, bbox);
        }
    }

    private closeHint() {
        if (this.hintService) {
            this.hintService.close();
        }
    }

    @HostListener('mouseenter', ['$event']) 
    onMouseEnter(event:MouseEvent) {
        if(this.hint && this.hint.trim() !== ''){
            this.timeout = setTimeout(()=>{
                this.openHint(event.srcElement.getBoundingClientRect());
            }, 200);
        }
    }

    @HostListener('mouseleave') 
    onMouseLeave() {
        clearTimeout(this.timeout);
        this.closeHint();
    }

    @HostListener('mousedown') 
    onMouseDown() {
        clearTimeout(this.timeout);
        this.closeHint();
    }
}