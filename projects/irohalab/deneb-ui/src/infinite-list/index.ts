import {NgModule} from '@angular/core';
import {InfiniteForOf} from './infinite-for-of';
import {InfiniteList} from './infinite-list';
import {CommonModule} from '@angular/common';
@NgModule({
    imports: [CommonModule, InfiniteForOf,
        InfiniteList],
    exports: [
        InfiniteForOf,
        InfiniteList
    ]
})
export class UIInfiniteListModule {

}

export * from './infinite-for-of';
export * from './infinite-list';
export * from './infinite-data-collection';
