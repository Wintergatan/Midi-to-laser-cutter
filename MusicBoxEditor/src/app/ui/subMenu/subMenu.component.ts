import { Component, OnInit, Input } from '@angular/core';

import { ISubMenuComponentOptions, ISubMenuButton} from './subMenu.interface';

@Component({
    selector: 'sub-menu',
    templateUrl: './subMenu.component.html',
    styleUrls: ['./subMenu.component.css']
})
export class SubMenuComponent implements OnInit {
    constructor() { }
    
    @Input() options: ISubMenuComponentOptions;

    ngOnInit(): void {
        if(this.options){
            this.options.component = this;
            if(this.options.onInit){
                this.options.onInit();
            }
        }
    }

    selectButton(indexOrButton: number | ISubMenuButton){
        let button: ISubMenuButton;

        if(typeof indexOrButton === 'number'){
            if(<number>indexOrButton < 0 || <number>indexOrButton >= this.options.buttons.length){
                return;
            }
            button = this.options.buttons[<number>indexOrButton];
        }else{
            button = <ISubMenuButton>indexOrButton;
        }

        if(!button){ return; }

        if(button.callback){
            button.callback();
        }
    }

    onClickButton(button: ISubMenuButton) {
        this.selectButton(button);
    }

    getBackgroundClass(){
        return {
            disableBackground: this.options.disableBackground ? true : false
        };
    }

    getIconClass(button: ISubMenuButton){
        var iconClass = {};
        if(button.iconClass){
            iconClass[button.iconClass] = true;
        }
        if(this.options.iconSize){
            iconClass[this.options.iconSize] = true;
        }
        return iconClass;
    }

    
    showSubMenu():boolean {
        if(!this.options){
            return false;
        }   
        return true;
    }

    showText(button: ISubMenuButton): boolean{
        if(this.options.disableText || !button || !button.text){ 
            return false; 
        }
        return true;
    }

    showIcon(button: ISubMenuButton): boolean{
        if(this.options.disableIcons || !button || !button.iconClass){ 
            return false; 
        }
        return true;
    }

    getHint(button: ISubMenuButton): string{
        if(this.options.disableText){
            return button.text;
        }
        return '';
    }
}
