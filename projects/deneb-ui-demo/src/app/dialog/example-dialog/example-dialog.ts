import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DARK_THEME, DarkThemeService, UIDialog, UIDialogRef } from '../../../../../irohalab/deneb-ui/src';
import { Subscription } from 'rxjs';
@Component({
    selector: 'example-dialog',
    templateUrl: 'example-dialog.html',
    styles: [`
        .dialog-content {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 400px;
            height: 300px;
            background-color: #fff;
        }
        .dialog-content > .ui.basic.segment {
            margin: 0;
            width: 100%;
            height: 100%;
            padding-bottom: 5rem;
        }
        .content {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .footer {
            width: 100%;
            height: 5rem;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    `],
    standalone: false
})
export class ExampleDialog implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input()
    boundContent: string;
    result: string;

    isDarkTheme: boolean;

    constructor(public dialogRef: UIDialogRef<ExampleDialog>,
                public dialog: UIDialog,
                private _darkThemeService: DarkThemeService) {}

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe(theme => {this.isDarkTheme = theme === DARK_THEME;})
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    openNewDialog() {
        let ref = this.dialog.open(ExampleDialog, this.dialogRef.config);
        ref.afterClosed().subscribe(
            (data) => {
                this.result = data;
            }
        );
    }

    save() {
        this.dialogRef.close('saved');
    }
    cancel() {
        this.dialogRef.close('cancel');
    }
}
