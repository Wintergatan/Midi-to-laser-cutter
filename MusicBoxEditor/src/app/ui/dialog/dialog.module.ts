import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';


export { DialogService, DialogComponent };
export * from './dialog.interface'; //<- this do not work in plunker for some reason. But you get the idea.
import { FormsModule } from "@angular/forms";


@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [ DialogComponent ],
  exports: [ DialogComponent ]
})
export class DialogModule {
    static forRoot() {
    return {
      ngModule: DialogModule,
      providers: [ DialogService ]
    }
  }
}