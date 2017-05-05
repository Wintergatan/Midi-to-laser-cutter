export interface IContextMenuOptions {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    text?: string;
    icon?: string;
    menu?: IContextMenuOptions[];
    callback?: ()=>void;
}