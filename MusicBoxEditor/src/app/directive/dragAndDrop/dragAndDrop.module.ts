import { NgModule, ModuleWithProviders } from '@angular/core';
import { DragAndDropService } from "./dragAndDrop.service";
import { DragStartDirective, DragOverDirective, DropDirective, DragSuccessDirective } from "./dragAndDrop.directive";

export { DragAndDropService };

@NgModule({    
    declarations: [DragStartDirective, DragSuccessDirective, DropDirective, DragOverDirective],
    exports: [DragStartDirective, DragSuccessDirective, DropDirective, DragOverDirective],
})
export class DragAndDropModule {
        static forRoot(): ModuleWithProviders {
        return {
            ngModule: DragAndDropModule,
            providers: [ DragAndDropService ]
        };
    }
}
