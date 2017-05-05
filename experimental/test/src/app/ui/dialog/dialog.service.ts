import { Injectable } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { IDialog, IDialogButton, IDialogSelect } from './dialog.interface';

@Injectable()
export class DialogService {
  renderer: DialogComponent;
  
  setRenderer(dialogComponent: DialogComponent){
    if(dialogComponent){
      this.renderer = dialogComponent;
    }
  }
  
  public openDialog(dialog: IDialog){
    if(!dialog){
      return;
    }
    
    this.renderer.openDialog(dialog);
    return dialog;
  }
  
  public openMessage(heading: string, content: string){
    var dialog: IDialog = {
      heading: heading,
      content: content,
      level: 'info',
      buttons: [{ text: 'Ok' }]
    }
    
    return this.openDialog(dialog);
  }

  public openSelect(heading: string, content: string, select: IDialogSelect, callback: ()=>void){
    var dialog: IDialog = {
      heading: heading,
      content: content,
      select: [select],
      level: 'info',
      buttons: [{ text: 'Ok', callback: callback }]
    }
    
    return this.openDialog(dialog);
  }
  
  public openQuestion(heading: string, content: string, confirm: ()=>void, decline: ()=>void){
    var dialog: IDialog = {
      heading: heading,
      content: content,
      level: 'info',
      buttons: [
        { text: 'Yes', callback: confirm }, 
        { text: 'No', callback: decline }
      ]
    }
    
    return this.openDialog(dialog);
  }
}