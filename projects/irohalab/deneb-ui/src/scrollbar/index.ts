import {UIScrollbar} from './scrollbar';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [CommonModule, UIScrollbar],
    exports: [UIScrollbar]
})
export class UIScrollbarModule {
}

export * from './scrollbar';
