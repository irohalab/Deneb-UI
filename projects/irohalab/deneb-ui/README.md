# DenebUI

A UI Building Blocks for Project mira-ui.

This library is a fork from [Deneb-UI](https://github.com/lordfriend/Deneb-UI) with Angular 20 support.

All components are standalone. Services use `providedIn: 'root'` and are available automatically without additional configuration.

## Install

```bash
npm i --save @irohalab/deneb-ui
```

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

### Demo

Please take a look at the [deneb-ui-demo](https://github.com/irohalab/Deneb-UI/tree/master/projects/deneb-ui-demo) application for more examples.
