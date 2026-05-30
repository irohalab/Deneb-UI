import {NgModule} from '@angular/core';
import {UIDialogContainer} from './dialog-container';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, UIDialogContainer],
    exports: [UIDialogContainer]
})
export class UIDialogModule {

}

export * from './dialog';
export * from './dialog-container';
export * from './dialog-ref';
