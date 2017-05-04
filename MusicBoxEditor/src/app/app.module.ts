import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TabMenuModule, ITabMenuComponentOptions, ITabMenuButton } from './ui/tabMenu/tabMenu.module';
import { SubMenuModule } from './ui/subMenu/subMenu.module';
import { HintModule } from './ui/hint/hint.module';
import { DialogModule } from './ui/dialog/dialog.module';

import { DragAndDropModule } from "./directive/dragAndDrop/dragAndDrop.module";


import { LogModule } from './service/log/log.module';
import { ContextMenuModule } from "./ui/contextMenu/contextMenu.module";
import { MtosStateModule } from "./service/mtosState/mtosState.module";

@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        LogModule.forRoot(),
        MtosStateModule.forRoot(),
        DragAndDropModule.forRoot(),
        TabMenuModule,
        SubMenuModule,
        HintModule.forRoot(),
        DialogModule.forRoot(),
        ContextMenuModule.forRoot(),
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
