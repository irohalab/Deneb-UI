import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const DARK_THEME = 'dark_theme';
export const LIGHT_THEME = 'light_theme';

const THEME_FOR_DENEB = 'theme_for_deneb';
export type ThemeName = 'dark_theme' | 'light_theme';
const EVENT_NAME = 'DenebThemeChange';

@Injectable()
export class DarkThemeService implements OnDestroy {
    private _globalListenerInstance: () => void;
    private _themeChangeSubject = new BehaviorSubject<string>(null);

    public get themeChange(): Observable<string> {
        return this._themeChangeSubject.asObservable();
    }

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        if (isPlatformBrowser(platformId)) {
            this.checkTheme();
            this.initGlobalListener();
        }
    }

    public changeTheme(theme: ThemeName): void {
        window.localStorage.setItem(THEME_FOR_DENEB, theme);
        this._themeChangeSubject.next(theme);
        const event = new CustomEvent(EVENT_NAME);
        window.dispatchEvent(event);
    }

    public getCurrentTheme(): ThemeName {
        return this._themeChangeSubject.value as ThemeName;
    }

    public ngOnDestroy(): void {
        window.removeEventListener(EVENT_NAME, this._globalListenerInstance);
    }

    private initGlobalListener(): void {
        this._globalListenerInstance = () => {
            this.checkTheme();
        };
        window.addEventListener(EVENT_NAME, this._globalListenerInstance);
    }
    private checkTheme(): void {
        const theme = window.localStorage.getItem(THEME_FOR_DENEB);
        if (theme === DARK_THEME || theme === LIGHT_THEME) {
            this._themeChangeSubject.next(theme);
        }
    }
}
