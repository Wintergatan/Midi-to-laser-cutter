import { NgModule, ModuleWithProviders } from '@angular/core';
import { MtosStateService, IHeader, INote, ITrack } from "./mtosState.service";

export { MtosStateService, IHeader, INote, ITrack };

@NgModule({})
export class MtosStateModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MtosStateModule,
            providers: [ MtosStateService ]
        };
    }
}