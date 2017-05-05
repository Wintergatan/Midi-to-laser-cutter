import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ContextMenuService } from "./contextMenu.service";
import { IContextMenuOptions } from "./contextMenu.interface";


@Directive({
    selector: '[context-menu]'
})
export class ContextMenuDirective {
    @Input('context-menu') private options: IContextMenuOptions;

    constructor(private contextMenuService: ContextMenuService) { }

    @HostListener('contextmenu', ['$event'])
    onMouseEnter(event: MouseEvent) {
        if (this.options) {
            this.options.x = event.clientX;
            this.options.y = event.clientY;
            this.contextMenuService.openContextMenu(this.options);
            event.preventDefault();
        }
    }

    @HostListener('mousedown')
    onMouseDown() {
        this.contextMenuService.closeContextMenu();
    }
}