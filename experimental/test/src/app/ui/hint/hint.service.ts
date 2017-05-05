import {Injectable} from '@angular/core';
import { HintComponent } from './hint.component';

@Injectable()
export class HintService {
    public renderer: HintComponent = null;

    constructor() { }

    public setRenderer(renderer: HintComponent) {
        this.renderer = renderer;
    }

    public open(hint: string, bbox: ClientRect): void {
        if (this.renderer) {
            this.renderer.open(hint, bbox);
        } else {
            console.log('Hint renderer not found, is it added to template?');
        }
    }

    public close(): void {
        if (this.renderer) {
            this.renderer.close();
        }
    }
}