A UI Building Blocks for Project mira-ui.

Forked from lordfriend/Deneb-UI. This project only support Angular 13 and above, for before Angular Ivy version, got to the lordfriend/Deneb-UI

Current implemented component:

- Dialog (modal)
- Toast
- Pagination
- InfiniteList
- TimelineMeter
- Dropdown (directive)
- Toggle
- Popover (service and directive), need Popper.js as dependency.

Notice: When you want to use toast, you must import `BrowserAnimationsModule` in your application module.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Dark Theme Support
All components support dark theme, for directive you need to implement your dark theme yourself. This UIModule provides
a DarkThemeService to change theme or subscribe to theme change. If you import the modules individually, you need to import the 
service to module providers manually:

```typescript
import { DarkThemeService } from '@irohalab/deneb-ui';
import { NgModule } from '@angular/core';

@NgModule({
    providers: [DarkThemeService]
})
class YourModule {
}
```
### Listen to theme change

To subscribe the `DarkThemeService` theme change observable:

```typescript
import { OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkThemeService } from '@irohalab/deneb-ui';
import { DARK_THEME } from '@irohalab/deneb-ui';

class YourComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    isDarkTheme: boolean;

    constructor(private _darkThemeService: DarkThemeService) {
    }

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe(theme => {
                    this.isDarkTheme = theme === DARK_THEME
                })
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
```
### Change the theme

```typescript
import { DarkThemeService } from '@irohalab/deneb-ui';
import { DARK_THEME } from '@irohalab/deneb-ui';

class YourComponent {
    constructor(private _darkThemeService: DarkThemeService) {
    }

    changeTheme(): void {
        this._darkThemeService.changeTheme(DARK_THEME);
    }
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
