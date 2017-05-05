//our root app component
import { Component, ViewChild, ElementRef } from '@angular/core';
import { DialogService } from './dialog.service';
import { IDialog, IDialogButton } from './dialog.interface';

@Component({
  selector: 'dialog-renderer',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  
  @ViewChild('buttons') public buttons: ElementRef;
  dialog: IDialog;
  
  constructor(private dialogService: DialogService) {
    this.dialogService.setRenderer(this);
    this.dialog;
  }
    
  public openDialog(dialog: IDialog): void{
    if(!dialog){
      return;
    }
    

    this.dialog = dialog;
    
    console.log(this);
    setTimeout(()=>{
      var buttonElements = this.buttons.nativeElement.getElementsByTagName('button');
      if(buttonElements && buttonElements.length > 0){
        buttonElements[0].focus();
      }
    }, 0)
  }
  
  public closeDialog(): void{
    this.dialog = null;
  }


  onBlurDialog(event: any){
    console.log(event);
  }

  public getDialogClass(): string{
    return this.dialog.level;
  }
  
  public showDialog(): boolean{
    if(!this.dialog){ 
      return false;
    }
    return true;
  }
  
  public showHeading(): boolean{
    if(!this.dialog || !this.dialog.heading){
      return false;
    }
    return true;
  }
  
  public showContent(): boolean{
    if(!this.dialog || !this.dialog.content){
      return false;
    }
    return true;
  }
  
  public showSelect(): boolean{
    if(!this.dialog || !this.dialog.select){
      return false;
    }
    return true;
  }

  public showButtons(): boolean{
    if(!this.dialog || !this.dialog.buttons){
      return false;
    }
    
    if(this.dialog.buttons.length <= 0){
      return false;
    }
    
    return true;
  }
  
  public onClickButton(button: IDialogButton): void{
    if(!button){
      return;
    }
    
    if(!button.disableClose){
      this.closeDialog();
    }
    
    if(button.callback){
      button.callback();
    }
  }
}