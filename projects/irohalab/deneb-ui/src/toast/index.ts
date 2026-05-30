import {NgModule} from '@angular/core';
import {UIToastComponent} from './toast.component';

@NgModule({
    imports: [UIToastComponent],
    exports: [UIToastComponent]
})
export class UIToastModule {

}

export * from './toast.component';
export * from './toast';
export * from './toast-injector';
export * from './toast-ref';
