import {NgModule} from '@angular/core';
import {UITimeLineMeter} from './timeline-meter';
import {UIScrollableContent} from './scrollable-content';
import {CommonModule} from '@angular/common';
import {UIScrollbarModule} from '../scrollbar';

const directives = [
    UITimeLineMeter,
    UIScrollableContent
];

@NgModule({
    exports: directives,
    imports: [CommonModule, UIScrollbarModule, ...directives]
})
export class UITimelineMeterModule {
}

export * from './scrollable-content';
export * from './timeline-meter';
