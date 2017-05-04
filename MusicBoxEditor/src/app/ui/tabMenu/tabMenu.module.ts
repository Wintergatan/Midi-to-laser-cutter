import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuComponent } from './tabMenu.component';

export { TabMenuComponent };
export * from './tabMenu.interface';

@NgModule({
    imports: [CommonModule],
    declarations: [TabMenuComponent],
    exports: [TabMenuComponent]
})
export class TabMenuModule { }
