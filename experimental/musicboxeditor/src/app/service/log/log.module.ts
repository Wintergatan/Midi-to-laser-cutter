import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogService, Logger } from './log.service';

export { LogService, Logger };

@NgModule({})
export class LogModule {
        static forRoot(): ModuleWithProviders {
        return {
            ngModule: LogModule,
            providers: [ LogService ]
        };
    }
}
