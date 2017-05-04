//our root app component
import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { ContextMenuService } from "./contextMenu.service";
import { IContextMenuOptions } from "./contextMenu.interface";

@Component({
    selector: 'context-menu-renderer',
    templateUrl: './contextMenuRenderer.component.html',
    styleUrls: ['./contextMenuRenderer.component.css']
})
export class ContextMenuRendererComponent implements OnInit {

    @Input() options: IContextMenuOptions

    constructor(private elementRef: ElementRef, private contextMenuService: ContextMenuService) {

    }

    ngOnInit(): void {
        this.contextMenuService.setRenderer(this);
    }

    //logic
    open(options: IContextMenuOptions) {
        if (!options) {
            return;
        }
        this.options = options;
        setTimeout(()=>{
            this.elementRef.nativeElement.children[0].focus();
        }, 0);
    }

    close() {
        this.options = null;
    }

    getEncapsulationId(): string {
        if (!this.elementRef) {
            return '';
        }

        var attr = this.elementRef.nativeElement.attributes;
        for(let i = 0; i < attr.length; i++){            
            let s:string  = attr[i].name;
            if(s.includes('_nghost')){
                return '_ngcontent' + s.substring(7);
            }
        }

        return '';
    }

    //template
    showContextMenu(): boolean {
        if (!this.options) {
            return false;
        }

        return true;
    }

    onBlurContextMenu(){
        this.close();
    }
}