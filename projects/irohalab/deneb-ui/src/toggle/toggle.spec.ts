import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UIToggleModule } from './index';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { UIToggle } from './toggle';
import { By } from '@angular/platform-browser';
import { DarkThemeService } from '../dark-theme.service';

describe('UIToggle', () => {

    let fixture: ComponentFixture<any>;


    function createEvent(type: string): Event {
        return new Event(type, {bubbles: true, cancelable: true});
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [UIToggleModule, FormsModule],
            declarations: [
                NgModelBasic
            ],
            providers: [DarkThemeService]
        });

        TestBed.compileComponents();
    }));

    describe('ngModel basic', () => {
        let testInstance: NgModelBasic;
        let labelElement: HTMLElement;
        let toggle: UIToggle;

        it('should change value of NgModelBasic by clicking the UIToggle', fakeAsync(() => {
            fixture = TestBed.createComponent(NgModelBasic);
            testInstance = fixture.componentInstance;
            labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
            toggle = fixture.debugElement.query(By.directive(UIToggle)).componentInstance;

            testInstance.value = true;
            fixture.detectChanges();

            // Flush the microtasks because the forms module updates the model state asynchronously.
            flushMicrotasks();
            // Now the new checked variable has been updated in the toggle and the toggle
            // is marked for check because it still needs to update the underlying input.
            fixture.detectChanges();

            expect(toggle.checked).toBe(true, 'Expected toggle to be checked initially');

            labelElement.click();

            fixture.detectChanges();

            tick();

            expect(toggle.checked).toBe(false, 'Expected toggle to be no longer checked after label click.');
        }));
    });
});

@Component({
    template: `
        <form>
            <ui-toggle [(ngModel)]="value" name="toggle1" (change)="onChange()"></ui-toggle>
        </form>`,
    standalone: false
})
class NgModelBasic {
    value: boolean;
    onChange: () => void = () => {};
    @ViewChild(UIToggle) toggle: UIToggle;
}
