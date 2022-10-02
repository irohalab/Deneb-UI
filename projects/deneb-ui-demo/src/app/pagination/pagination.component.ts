import {Component, OnInit} from '@angular/core';

// require('semantic-ui-less/definitions/collections/menu.less');
// require('semantic-ui-less/definitions/elements/icon.less');

@Component({
    selector: 'pagination-demo',
    templateUrl: './pagination.html'
})
export class PaginationDemo implements OnInit {
    currentPage: number;
    total: number;
    countPerPage: number;
    max: number;
    ngOnInit(): void {
        this.currentPage = 1;
        this.total = 200;
        this.countPerPage = 10;
        this.max = 6;
    }

    onPageUpdate(page: number) {
        console.log(page);
    }
}
