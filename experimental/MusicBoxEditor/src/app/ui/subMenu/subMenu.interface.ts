import { SubMenuComponent } from './subMenu.component';

export interface ISubMenuButton {
    text: string;
    callback?: ()=>void;
    iconClass?: string;
}

export interface ISubMenuComponentOptions {
    component?: SubMenuComponent;
    onInit?: ()=>void;
    disableBackground?: boolean;
    disableIcons?: boolean;
    disableText?: boolean;
    iconSize?: string;
    buttons?: ISubMenuButton[];
}