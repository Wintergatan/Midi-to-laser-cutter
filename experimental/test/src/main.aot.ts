
import "reflect-metadata"; //only needed for jit.

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

console.info('app.environment:', app.environment);
if(document.readyState === "complete" || document.readyState === "interactive") {
    console.log('Bootstrapping app');
    enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule);
}
else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log('Bootstrapping app');
        enableProdMode();
        platformBrowserDynamic().bootstrapModule(AppModule);
    });
}
