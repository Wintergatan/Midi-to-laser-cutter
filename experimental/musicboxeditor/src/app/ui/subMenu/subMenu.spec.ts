import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubMenuModule, SubMenuComponent, ISubMenuComponentOptions } from './submenu.module';
import { HintModule } from "../hint/hint.module";

describe('SubMenuComponent', () => {
  
  let fixture: ComponentFixture<SubMenuComponent>;
  let comp:    SubMenuComponent;
  let el:      HTMLElement;

  let options: ISubMenuComponentOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SubMenuModule, HintModule.forRoot() ]
    });

    fixture = TestBed.createComponent(SubMenuComponent);
    comp = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    
    options = {
      onInit: ()=>{},
      buttons: [{
          text: 'First',
          iconClass: 'int-icon-first',
          callback: ()=>{ 
              this.logger.logDebug('MainMenu clicked: Save');
          }
      }, {
          text: 'Secound',
          iconClass: 'int-icon-secound',
          callback: ()=>{ 
              this.logger.logDebug('MainMenu clicked: Exit');
          }
      }]
    };
  });
  
  it('should create the SubMenuComponent', () => {
      expect(comp).toBeTruthy();  
  });

  it('should have options.component', () => {
    
    expect(options.component).toBeFalsy();

    comp.options = options;
    fixture.detectChanges();

    expect(options.component).toBeTruthy();
  });

  it('should call onInit when options is defined', () => {
    
    let onInitCalled = false;
    options.buttons = [];
    options.onInit = ()=>{
      onInitCalled = true;  
    }

    expect(onInitCalled).toBeFalsy();

    comp.options = options;
    fixture.detectChanges();

    expect(onInitCalled).toBeTruthy();
  });

  it('should be visible when options is defined', () => {
    options.buttons = [];

    var submenu = el.getElementsByClassName('sub-menu');
    var buttons = el.getElementsByClassName('button');

    expect(comp.showSubMenu()).toBeFalsy(); 
    expect(submenu.length).toBe(0); 
    expect(buttons.length).toBe(0); 

    comp.options = options;
    fixture.detectChanges();

    submenu = el.getElementsByClassName('sub-menu');
    buttons = el.getElementsByClassName('button');
    
    expect(comp.showSubMenu()).toBeTruthy();
    expect(submenu.length).toBe(1); 
    expect(buttons.length).toBe(0);   
  });

  it('should have buttons with text when options.buttons is defined', () => {

    var buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(0); 

    comp.options = options;
    fixture.detectChanges();

    buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(2);

    expect(buttons[0].getElementsByTagName('h4')[0].textContent).toBe('First');
    expect(buttons[1].getElementsByTagName('h4')[0].textContent).toBe('Secound');   

  });

  it('should have buttons with icons when options.buttons is defined', () => {

    var buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(0); 

    comp.options = options;
    fixture.detectChanges();

    buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(2);

    expect(buttons[0].getElementsByTagName('i')[0].classList[0]).toBe('int-icon-first');
    expect(buttons[1].getElementsByTagName('i')[0].classList[0]).toBe('int-icon-secound');   

  });

  it('should have buttons with no icons when options.disableIcons = true', () => {
    options.disableIcons = true;
    comp.options = options;
    fixture.detectChanges();

    var buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(2);

    expect(el.getElementsByTagName('i').length).toBe(0);
  });

  it('should have buttons with no text when options.disableText = true', () => {
    options.disableText = true;
    comp.options = options;
    fixture.detectChanges();

    var buttons = el.getElementsByClassName('button');
    expect(buttons.length).toBe(2);

    expect(el.getElementsByTagName('h4').length).toBe(0);
  });

  it('should call button callback when button is clicked', () => {
    let buttonCallback = false;
    options.buttons[0].callback = ()=>{
      buttonCallback = true;
    }

    expect(buttonCallback).toBeFalsy();

    comp.options = options;
    fixture.detectChanges();

    expect(buttonCallback).toBeFalsy();

    let buttons = el.getElementsByTagName('button');
    buttons[0].click();

    expect(buttonCallback).toBeTruthy();
  });
});