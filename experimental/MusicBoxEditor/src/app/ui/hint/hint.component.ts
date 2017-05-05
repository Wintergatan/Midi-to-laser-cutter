import {Component, ViewChild, ElementRef} from '@angular/core'

import {HintService} from './hint.service';

@Component({
  selector: 'hint-renderer',
  providers: [],
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.css'],
})
export class HintComponent {
  private offset = 3;


  @ViewChild('box') public hintBox: ElementRef;

  public hint: string;
  public pos: { x: number, y: number };
  public bbox: ClientRect;


  constructor( private hintService: HintService) {
    this.hintService.setRenderer(this);
    this.pos = {x: 0, y: 0};
  }


  public close() {
    this.hint = null;
  }

  public open(hint: string, bbox: ClientRect) {
    this.hint = hint;
    this.bbox = this.getBbox();

    var left = bbox.left;
    if(left + this.bbox.width > window.innerWidth){
      left = bbox.right - this.bbox.width;
    }

    if(left < 0){
      left = 0 + this.offset;
    }
    
    var top = bbox.bottom + this.offset;
    if(top + this.bbox.height > window.innerHeight){
      top = bbox.top - this.bbox.height - this.offset;
    }

    if(top < 0){
      top = 0 + this.offset;
    }

    this.pos.x = left;
    this.pos.y = top;
  }

  public getBbox(): ClientRect {
    var test = this.getVirtualBox();
    document.body.appendChild(test);
    var bbox = test.children[0].getBoundingClientRect();
    document.body.removeChild(test);
    return bbox;
  }

  public getVirtualBox(): HTMLElement {
    var tag = document.createElement("hint-renderer");
    var box = document.createElement("div");
    var text = document.createElement("label");
    box.classList.add('box');
    text.classList.add('text');
    text.innerText = this.hint;
    box.appendChild(text);
    tag.appendChild(box);

    return tag;
  }
}