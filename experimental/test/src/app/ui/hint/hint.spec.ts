import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HintModule, HintComponent } from './hint.module';
import { HintService } from "./hint.service";

describe('HintComponent', () => {
  
  let fixture: ComponentFixture<HintComponent>;
  let comp: HintComponent;
  let el:      HTMLElement;
  let service: HintService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HintModule.forRoot()
      ]
    });

    fixture = TestBed.createComponent(HintComponent);
    comp = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    service = fixture.debugElement.injector.get(HintService);

  });

  it('should create the HintComponent', () => {
      expect(comp).toBeTruthy();  
  });

  
  it('should have default values', () => {
      expect(comp.hint).toBeUndefined();  
      expect(comp.pos.x).toBe(0);
      expect(comp.pos.y).toBe(0);      
      expect(comp.bbox).toBeUndefined();
  });

  it('should display hint', ()=>{
    service.open('This is a hint', {top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 })

    fixture.detectChanges();

    expect(comp.hint).toBe('This is a hint');
    expect(el.getElementsByTagName('label')[0].textContent).toBe('This is a hint');
  });

});