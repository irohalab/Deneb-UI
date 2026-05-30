import {
    Component, inject
} from '@angular/core';
import { DARK_THEME, DarkThemeService, LIGHT_THEME, UIToggle } from '../../../irohalab/deneb-ui/src';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

// require('semantic-ui-less/definitions/modules/sidebar.less');

@Component({
    selector: 'app',
    templateUrl: 'app.html',
    styles: [`
        .main-container {
            position: fixed;
            top: 0;
            left: 210px;
            right: 0;
            bottom: 0;
            overflow-x: hidden;
            overflow-y: auto;
            &.dark-theme {
                background-color: #1b1c1d;
            }
        }
    `],
    imports: [RouterOutlet, RouterLink, FormsModule, UIToggle, NgClass]
})
export class App {
    private _darkThemeService = inject(DarkThemeService);
    private _darkTheme: boolean;
    get darkTheme(): boolean {
        return this._darkTheme;
    }
    set darkTheme (v: boolean) {
        this._darkTheme = v;
        this._darkThemeService.changeTheme(v ? DARK_THEME : LIGHT_THEME);
    }
    constructor() {
        this._darkTheme = this._darkThemeService.getCurrentTheme() === DARK_THEME;
    }
}
