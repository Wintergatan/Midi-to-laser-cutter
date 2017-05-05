import { Component, OnInit, Input } from '@angular/core';
import { ITabMenuComponentOptions, ITabMenuButton } from './tabMenu.interface';

@Component({
    selector: 'tab-menu',
    templateUrl: './tabMenu.component.html',
    styleUrls: ['./tabMenu.component.css'],
})
export class TabMenuComponent implements OnInit {


    @Input() options: ITabMenuComponentOptions;

    public selected: ITabMenuButton = null;

    constructor() { }

    ngOnInit(): void {
        if(this.options){
            this.options.component = this;
            if(this.options.onInit){
                this.options.onInit();
            }
        }
    }

    selectButton(indexOrButton: number | ITabMenuButton){
        let button: ITabMenuButton;

        if(typeof indexOrButton === 'number'){
            if(<number>indexOrButton < 0 || <number>indexOrButton >= this.options.buttons.length){
                return;
            }
            button = this.options.buttons[<number>indexOrButton];
        }else{
            button = <ITabMenuButton>indexOrButton;
        }

        if(!button){ return; }

        if(button.callback && button.callback() === true){
            this.selected = button;
        }
    }

    onClickButton(button: ITabMenuButton) {
        this.selectButton(button);
    }

    showTabMenu():boolean {
        if(!this.options){
            return false;
        }
        return true;
    }

    getButtonClass(button: ITabMenuButton): Object {
        if(!button){ return {}; }
        return {
            isSelected: this.isSelectedButton(button)
        }
    }

    isSelectedButton(button: ITabMenuButton) {
        if(!button){ return false; }
        if(this.selected === button){
            return true;
        }
        return false;
    }
}
