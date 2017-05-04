import { Injectable } from '@angular/core';
import { ContextMenuRendererComponent } from "./contextMenuRenderer.component";
import { IContextMenuOptions } from "./contextMenu.interface";

@Injectable()
export class ContextMenuService {
    renderer: ContextMenuRendererComponent;

    elementHeight: number;
    halfPadding: number;
    padding: number;

    setRenderer(contextMenuComponent: ContextMenuRendererComponent) {
        if (contextMenuComponent) {
            this.renderer = contextMenuComponent;
        }
    }

    public openContextMenu(options: IContextMenuOptions) {
        if (!this.renderer) {
            return;
        }
        this.updatePositions(options);
        this.renderer.open(options);
    }

    public closeContextMenu() {
        this.renderer.close();
    }

    updatePositions(menu: IContextMenuOptions){
        var id = this.renderer.getEncapsulationId();

        var contextMenuElement = this.createElement('div', id, 'context-menu');
        var element = this.createElement('div', id, 'element');
        var text = this.createElement('div', id, null);
        text.innerText = 'Text'

        element.appendChild(text);
        contextMenuElement.appendChild(element);

        var appElement = document.getElementsByTagName('app')[0];
        
        appElement.appendChild(contextMenuElement);

        var a = contextMenuElement.getBoundingClientRect();
        var b = element.getBoundingClientRect();

        appElement.removeChild(contextMenuElement);

        var width = a.width;
        this.elementHeight = b.height;
        this.padding = (a.height - b.height);
        this.halfPadding = this.padding / 2;

        menu.width = menu.width ? menu.width : 100;
        menu.x = menu.x ? menu.x : 0;
        menu.y = menu.y ? menu.y : 0;

        if(menu.menu){
            menu.height = menu.menu.length * this.elementHeight + this.padding;
        }

        if(menu.height > window.innerHeight){
            menu.height = window.innerHeight;
        }

        if(menu.x + menu.width > window.innerWidth){
            menu.x = window.innerWidth - menu.width;
        }

        if(menu.y + menu.height > window.innerHeight){
            menu.y = window.innerHeight - menu.height;
        }

        if(menu.menu){
            for(var i = 0; i < menu.menu.length; i++){
                var m = menu.menu[i];
                if(!m){ continue; }
                this.calculateMenuSize(m, menu);
            }
        }
    }

    createElement(type: string, attribute: string, className: string){
        var tmp = document.createElement(type);
        tmp.setAttribute(attribute, '');
        if(className){
            tmp.classList.add(className);
        }
        return tmp;
    }

    calculateMenuSize(menu: IContextMenuOptions, parent: IContextMenuOptions){
        if(!menu || !parent){ return; }

        menu.width = parent.width;
        menu.x = parent.x + menu.width - 1;

        var index = parent.menu.indexOf(menu);
        if(index > -1){
            menu.y = parent.y + this.elementHeight * index;
        }

        if(menu.menu){
            menu.height = menu.menu.length * this.elementHeight;
        }else{
            menu.height = 0;
        }

        if(menu.height > window.innerHeight){
            menu.height = window.innerHeight;
        }

        //if outside of screen
        if(menu.x + menu.width > window.innerWidth){
            menu.x = parent.x - menu.width + 1;
        }

        if(menu.y + menu.height > window.innerHeight){
            menu.y = window.innerHeight - menu.height;
        }

        if(menu.menu){
            for(var i = 0; i < menu.menu.length; i++){
                var m = menu.menu[i];
                if(!m){ continue; }
                this.calculateMenuSize(m, menu);
            }
        }
    }
}