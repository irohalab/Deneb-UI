import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const DARK_THEME = 'dark_theme';
export const LIGHT_THEME = 'light_theme';

const THEME_FOR_DENEB = 'theme_for_deneb';
export type ThemeName = 'dark_theme' | 'light_theme';

@Injectable()
export class DarkThemeService {
    private _themeChangeSubject = new BehaviorSubject<string>(null);

    public get themeChange(): Observable<string> {
        return this._themeChangeSubject.asObservable();
    }

    constructor() {
        const theme = window.localStorage.getItem(THEME_FOR_DENEB);
        if (theme === DARK_THEME || theme === LIGHT_THEME) {
            this._themeChangeSubject.next(theme);
        }
    }

    public changeTheme(theme: ThemeName): void {
        window.localStorage.setItem(THEME_FOR_DENEB, theme);
        this._themeChangeSubject.next(theme);
    }

    public getCurrentTheme(): ThemeName {
        return this._themeChangeSubject.value as ThemeName;
    }
}
