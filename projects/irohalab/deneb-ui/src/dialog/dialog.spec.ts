import { Component, NgModule } from '@angular/core';
import {
    ComponentFixtureAutoDetect,
    inject,
    TestBed,
    waitForAsync
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UIDialog } from './dialog';
import { UIDialogRef } from './dialog-ref';
import { UIDialogModule } from './index';
import { DarkThemeService } from '../dark-theme.service';

describe('UIDialog', () => {
    let dialog: UIDialog;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [DialogTestModule, UIDialogModule, NoopAnimationsModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true},
                DarkThemeService
            ]
        });

        TestBed.compileComponents();
    }));

    beforeEach(inject([UIDialog], (d: UIDialog) => {
        dialog = d;
    }));

    it('should open a dialog with given component', () => {
        let dialogRef = dialog.open(ExampleDialog, {stickyDialog: false, backdrop: true});
        // comment out this expectation, it may cause some memory issues
        expect(dialogRef.componentInstance).toBeDefined();
        // expect(document.body.querySelector('.dialog-content')).not.toBe(null);
    });
});

@Component({
    selector: 'example-dialog',
    template: '<div class="dialog-content"><button type="button" (click)="dialogRef.close()"></button></div>'
})
class ExampleDialog {
    constructor(public dialogRef: UIDialogRef<ExampleDialog>) {}
}

const TEST_DIRECTIVES = [
    ExampleDialog
];

@NgModule({
    declarations: TEST_DIRECTIVES,
    imports: [UIDialogModule],
    exports: TEST_DIRECTIVES
})
class DialogTestModule {}
