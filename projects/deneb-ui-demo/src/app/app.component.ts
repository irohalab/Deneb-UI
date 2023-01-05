import {
    Component
} from '@angular/core';
import { DARK_THEME, DarkThemeService, LIGHT_THEME } from '../../../irohalab/deneb-ui/src/dark-theme.service';

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
    `]
})
export class App {
    private _darkTheme: boolean;
    get darkTheme(): boolean {
        return this._darkTheme;
    }
    set darkTheme (v: boolean) {
        this._darkTheme = v;
        this._darkThemeService.changeTheme(v ? DARK_THEME : LIGHT_THEME);
    }
    constructor(private _darkThemeService: DarkThemeService) {
        this._darkTheme = this._darkThemeService.getCurrentTheme() === DARK_THEME;
    }
}
