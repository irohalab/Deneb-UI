import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UIToggle } from '../../../../irohalab/deneb-ui/src';

@Component({
    selector: 'toggle-example',
    templateUrl: './toggle.html',
    styles: [`
        .ui.form.dark {
            background: #000;
            color: #fff;
        }
    `],
    imports: [FormsModule, UIToggle]
})
export class ToggleDemo {
    value1 = true;
    value2 = false;
    value3 = true;
    value4 = false;
    value5 = true;
    value6 = true;
}
