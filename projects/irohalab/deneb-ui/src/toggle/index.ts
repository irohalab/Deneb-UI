import { NgModule } from '@angular/core';
import { UIToggle } from './toggle';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, UIToggle],
    exports: [UIToggle]
})
export class UIToggleModule {

}

export * from './toggle';
