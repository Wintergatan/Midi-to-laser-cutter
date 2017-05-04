import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HintModule } from '../hint/hint.module';
import { SubMenuComponent } from './subMenu.component';

export * from './subMenu.interface';
export { SubMenuComponent };

@NgModule({
    imports: [CommonModule, HintModule ],
    declarations: [SubMenuComponent],
    exports: [SubMenuComponent]
})
export class SubMenuModule { }
