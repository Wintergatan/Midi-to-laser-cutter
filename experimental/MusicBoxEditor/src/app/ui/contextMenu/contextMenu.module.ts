import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from "./contextMenu.component";
import { ContextMenuService } from "./contextMenu.service";
import { ContextMenuDirective } from "./contextMenu.directive";
import { ContextMenuRendererComponent } from "./contextMenuRenderer.component";


export { ContextMenuDirective, ContextMenuComponent, ContextMenuService }
export * from './contextMenu.interface';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ContextMenuComponent, ContextMenuRendererComponent, ContextMenuDirective ],
  exports: [ ContextMenuComponent, ContextMenuRendererComponent, ContextMenuDirective ]
})
export class ContextMenuModule {
    static forRoot() {
    return {
      ngModule: ContextMenuModule,
      providers: [ ContextMenuService ]
    }
  }
}