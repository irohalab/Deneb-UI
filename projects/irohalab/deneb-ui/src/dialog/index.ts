import {NgModule} from '@angular/core';
import {UIDialog} from './dialog';
import {UIDialogContainer} from './dialog-container';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [UIDialogContainer],
    providers: [UIDialog],
    imports: [CommonModule],
    exports: [UIDialogContainer]
})
export class UIDialogModule {

}

export * from './dialog';
export * from './dialog-container';
export * from './dialog-ref';
