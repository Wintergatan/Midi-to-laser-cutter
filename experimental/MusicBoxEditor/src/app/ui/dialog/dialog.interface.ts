export interface IDialogButton {
  text?: string;
  disableClose?: boolean;
  callback?: ()=>void;
};

export interface IDialogSelect {
  text?: string;
  selected?: any;
  options?: any; //{key: string, value: string};
};

export interface IDialog {
  heading?: string;
  content?: string;
  level?: string;
  buttons?: IDialogButton[];
  select?: IDialogSelect[];
};