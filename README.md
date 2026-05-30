A UI Building Blocks for Project mira-ui.

Forked from lordfriend/Deneb-UI. This project supports Angular 20 with standalone components.

All components are standalone. Services use `providedIn: 'root'` and are available automatically without additional configuration.

## Install

```bash
npm i --save @irohalab/deneb-ui
```

## Components

- Dialog (modal)
- Toast
- Pagination
- InfiniteList
- TimelineMeter
- Dropdown (directive)
- Toggle
- Popover (service and directive), needs Popper.js as dependency.

Notice: When you want to use toast, you must provide `provideAnimations()` in your application config or import `BrowserAnimationsModule` in your application module.

## Usage

### Standalone Components (Recommended)

Import individual components directly in your standalone component or NgModule:

```typescript
import { Component } from '@angular/core';
import { UIPagination, UIToggle, UIDropdown } from '@irohalab/deneb-ui';

@Component({
  selector: 'app-example',
  imports: [UIPagination, UIToggle, UIDropdown],
  template: `...`
})
export class ExampleComponent {}
```

Services like `UIDialog`, `UIToast`, `UIPopover`, `DarkThemeService`, and `UIResponsiveService` are provided at the root level and can be injected directly:

```typescript
import { Component, inject } from '@angular/core';
import { UIDialog } from '@irohalab/deneb-ui';

@Component({ ... })
export class ExampleComponent {
  private dialog = inject(UIDialog);
}
```

### NgModule (Legacy)

NgModule wrappers are still available for backward compatibility:

```typescript
import { NgModule } from '@angular/core';
import { UIDialogModule, UIToastModule } from '@irohalab/deneb-ui';

@NgModule({
  imports: [UIDialogModule, UIToastModule]
})
export class AppModule {}
```

## Dark Theme Support
You should set your background color as `#1b1c1d` just the same color as semantic ui.

All components support dark theme. `DarkThemeService` is provided at root level and can be injected directly.

### Listen to theme change

```typescript
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { DarkThemeService, DARK_THEME } from '@irohalab/deneb-ui';

@Component({ ... })
export class YourComponent implements OnInit, OnDestroy {
    private darkThemeService = inject(DarkThemeService);
    protected isDarkTheme = signal(false);
    private subscription: Subscription;

    ngOnInit(): void {
        this.subscription = this.darkThemeService.themeChange
            .subscribe(theme => {
                this.isDarkTheme.set(theme === DARK_THEME);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
```

### Change the theme

```typescript
import { Component, inject } from '@angular/core';
import { DarkThemeService, DARK_THEME } from '@irohalab/deneb-ui';

@Component({ ... })
export class YourComponent {
    private darkThemeService = inject(DarkThemeService);

    changeTheme(): void {
        this.darkThemeService.changeTheme(DARK_THEME);
    }
}
```

### Demo

Please take a look at the [deneb-ui-demo](https://github.com/irohalab/Deneb-UI/tree/master/projects/deneb-ui-demo) application for more examples.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
