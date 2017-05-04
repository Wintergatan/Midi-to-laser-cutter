import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HintService } from './hint.service';
import { HintComponent } from './hint.component';
import { Hint } from './hint.directive';

export { HintComponent, Hint };

@NgModule({
    imports: [CommonModule],
    declarations: [Hint, HintComponent],
    exports: [Hint, HintComponent]
})
export class HintModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HintModule,
            providers: [ HintService ]
        };
    }
}