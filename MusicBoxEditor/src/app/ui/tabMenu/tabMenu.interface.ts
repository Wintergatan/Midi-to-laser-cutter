import { TabMenuComponent } from './tabMenu.component';

export interface ITabMenuButton {
    text: string;
    callback?: ()=>boolean;
}

export interface ITabMenuComponentOptions {
    component?: TabMenuComponent;
    onInit?: ()=>void;
    buttons?: ITabMenuButton[];
}