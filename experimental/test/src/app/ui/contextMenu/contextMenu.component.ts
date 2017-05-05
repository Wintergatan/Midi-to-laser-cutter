//our root app component
import { Component, ViewChild, ElementRef, OnInit, Input, HostBinding } from '@angular/core';
import { ContextMenuService } from "./contextMenu.service";
import { IContextMenuOptions } from "./contextMenu.interface";

@Component({
    selector: 'context-menu',
    templateUrl: './contextMenu.component.html',
    styleUrls: ['./contextMenu.component.css']
})
export class ContextMenuComponent implements OnInit {

    @Input() options: IContextMenuOptions;

    @HostBinding('style.left.px') x = 0;
    @HostBinding('style.top.px') y = 0;
    @HostBinding('style.width.px') width = 0;
    @HostBinding('style.height.px') height = 0;

    private openElement: IContextMenuOptions;

    constructor(private elementRef: ElementRef, private contextMenuService: ContextMenuService) {
    }

    ngOnInit(): void {  
        if(!this.options){
            return;
        }

        this.x = this.options.x ? this.options.x : 0;
        this.y = this.options.y ? this.options.y : 0;
        this.width = this.options.width ? this.options.width : 50;
        this.height = this.options.height ? this.options.height : 50;
    }

    //template
    showSubMenu(menu: IContextMenuOptions): boolean {
        if(this.openElement === menu && this.openElement.menu && this.openElement.menu.length > 0){
            return true;
        }

        return false;
    }

    showSubMenuIcon(menu: IContextMenuOptions): boolean{
        if(!menu || !menu.menu || menu.menu.length <= 0){
            return false;
        }

        return true;
    }

    getIconClass(menu: IContextMenuOptions): string{
        if(menu.icon){
            return menu.icon;
        }
        return '';
    }

    onBlurMenu() {
        this.contextMenuService.closeContextMenu();
    }

    onClickMenu(menu: IContextMenuOptions) {
        if (!menu || !menu.callback) {
            return;
        }

        menu.callback();

        this.contextMenuService.closeContextMenu();
    }

    onMouseEnterElement(menu: IContextMenuOptions){
        this.openElement = menu;
    }

}