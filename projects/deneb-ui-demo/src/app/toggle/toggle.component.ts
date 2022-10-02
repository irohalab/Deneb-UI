import { Component } from '@angular/core';

@Component({
    selector: 'toggle-example',
    templateUrl: './toggle.html',
    styles: [`
        .ui.form.dark {
            background: #000;
            color: #fff;
        }
    `]
})
export class ToggleDemo {
    value1 = true;
    value2 = false;
    value3 = true;
    value4 = false;
    value5 = true;
    value6 = true;
}
