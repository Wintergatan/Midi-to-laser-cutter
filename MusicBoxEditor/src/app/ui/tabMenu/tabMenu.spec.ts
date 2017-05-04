import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabMenuModule, TabMenuComponent, ITabMenuComponentOptions } from "./tabMenu.module";

describe('TabMenuComponent', () => {

    let fixture: ComponentFixture<TabMenuComponent>;
    let comp: TabMenuComponent;
    let el: HTMLElement;

    let options: ITabMenuComponentOptions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TabMenuModule]
        });

        fixture = TestBed.createComponent(TabMenuComponent);
        comp = fixture.componentInstance;
        el = fixture.debugElement.nativeElement;

        options = {
            onInit: () => { },
            buttons: [{
                text: 'First',
                callback: () => {

                    return true;
                }
            }, {
                text: 'Secound',
                callback: () => {
                    return false;
                }
            }]
        };
    });

    it('should create the TabMenuComponent', () => {
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
        options.onInit = () => {
            onInitCalled = true;
        }

        expect(onInitCalled).toBeFalsy();

        comp.options = options;
        fixture.detectChanges();

        expect(onInitCalled).toBeTruthy();
    });

    it('should be visible when options is defined', () => {
        options.buttons = [];

        var submenu = el.getElementsByClassName('tab-menu');
        var buttons = el.getElementsByClassName('button');

        expect(comp.showTabMenu()).toBeFalsy();
        expect(submenu.length).toBe(0);
        expect(buttons.length).toBe(0);

        comp.options = options;
        fixture.detectChanges();

        submenu = el.getElementsByClassName('tab-menu');
        buttons = el.getElementsByClassName('button');

        expect(comp.showTabMenu()).toBeTruthy();
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

        expect(buttons[0].getElementsByTagName('h2')[0].textContent).toBe('First');
        expect(buttons[1].getElementsByTagName('h2')[0].textContent).toBe('Secound');

    });

    it('should call button callback when button is clicked', () => {
        let buttonCallback = false;
        options.buttons[0].callback = () => {
            buttonCallback = true;
            return true;
        }

        expect(buttonCallback).toBeFalsy();

        comp.options = options;
        fixture.detectChanges();

        expect(buttonCallback).toBeFalsy();

        let buttons = el.getElementsByTagName('button');
        buttons[0].click();

        expect(buttonCallback).toBeTruthy();
    });

    it('should set selected when button is selecable', () => {
        expect(comp.selected).toBeFalsy();

        comp.options = options;
        fixture.detectChanges();

        expect(comp.selected).toBeFalsy();

        comp.selectButton(0);

        expect(comp.selected.text).toBe('First');
    });

    it('should set selected when button is clicked', () => {
        expect(comp.selected).toBeFalsy();

        comp.options = options;
        fixture.detectChanges();

        expect(comp.selected).toBeFalsy();

        el.getElementsByTagName('button')[0].click();

        expect(comp.selected.text).toBe('First');
    });

    it('should not set selected when button is not selectable', () => {
        expect(comp.selected).toBeFalsy();

        comp.options = options;
        fixture.detectChanges();

        expect(comp.selected).toBeFalsy();

        comp.selectButton(1);

        expect(comp.selected).toBeFalsy();
    });

});