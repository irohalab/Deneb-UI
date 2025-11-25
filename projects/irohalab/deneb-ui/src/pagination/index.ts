import {UIPagination} from './pagination';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [CommonModule, UIPagination],
    exports: [UIPagination]
})
export class UIPaginationModule {

}

export * from './pagination';
