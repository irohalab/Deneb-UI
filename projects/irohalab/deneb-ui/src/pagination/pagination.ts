import {Component, Input, Output, EventEmitter} from '@angular/core';


export interface PageNumber {
    number: number,
    text: string,
    active: boolean
}

@Component({
    selector: 'ui-pagination',
    template: `
        <div class="ui pagination menu">
            <a class="item page-navigator" [ngClass]="{disabled: currentPage <= 1}" (click)="prevPage()">
                <i class="angle left icon"></i>
            </a>
            <a class="item page-num" *ngFor="let page of pageNumberList" [ngClass]="{active: page.active}"
               (click)="onClickPage(page)">
                {{page.text}}
            </a>
            <a class="item page-navigator" [ngClass]="{disabled: currentPage >= totalPages}" (click)="nextPage()">
                <i class="angle right icon"></i>
            </a>
        </div>
    `
})
export class UIPagination {

    _currentPageNumber: number;
    private _total: number;
    private _countPerPage: number;
    private _max: number = Number.MAX_SAFE_INTEGER;

    pageNumberList: PageNumber[] = [];
    totalPages: number;

    @Output()
    pageChange = new EventEmitter<number>();

    @Input()
    set currentPage(page: number) {
        if (page !== this._currentPageNumber) {
            this._currentPageNumber = page;
            this.pageNumberList = this.updatePageNumberList();
        }
    }

    get currentPage(): number {
        return this._currentPageNumber;
    }

    @Input()
    set total(total: number) {
        this._total = total;
        if (!this.isUndefined(this._total) && !this.isUndefined(this._currentPageNumber) && !this.isUndefined(this._countPerPage)) {
            this.pageNumberList = this.updatePageNumberList();
        }
    }

    @Input()
    set countPerPage(count: number) {
        this._countPerPage = count;
        this.pageNumberList = this.updatePageNumberList();
    }

    @Input()
    set max(max: number) {
        if (max <= 1) {
            throw new Error('max size must greater than 1');
        }
        this._max = max;
        this.pageNumberList = this.updatePageNumberList();
    }

    onClickPage(page: PageNumber) {
        if (page.number !== this._currentPageNumber) {
            this.currentPage = page.number;
            this.pageChange.emit(page.number);
        }
    }

    prevPage() {
        if (this._currentPageNumber <= 1) {
            return;
        }
        this.currentPage--;
        this.pageChange.emit(this._currentPageNumber);
    }

    nextPage() {
        if (this._currentPageNumber >= this.totalPages) {
            return;
        }
        this.currentPage++;
        this.pageChange.emit(this._currentPageNumber);
    }

    private isUndefined(obj: any) {
        return typeof obj === 'undefined';
    }

    private makePage(number: number, text: string): PageNumber {
        return {
            number: number,
            text: text,
            active: number == this.currentPage
        }
    }

    private updatePageNumberList(): PageNumber[] {
        // console.log('rebuild pages');
        let maxSize = this._max;
        let currentPage = this.currentPage;
        this.totalPages = Math.ceil(this._total / this._countPerPage);
        let pages: PageNumber [] = [];
        let startPage = 1, endPage = this.totalPages;
        let isMaxSized = maxSize < this.totalPages;
        if (!isMaxSized) {
            for (let i = startPage; i <= endPage; i++) {
                if (i == currentPage) {
                    pages.push(this.makePage(i, i + ''))
                } else {
                    pages.push(this.makePage(i, i + ''))
                }
            }
        } else {
            let lp = Math.max(currentPage - 1, startPage);
            let rp = Math.min(currentPage + 1, endPage);
            if (lp != currentPage && rp !== currentPage) {
                pages.push(this.makePage(currentPage, currentPage + ''));
            }
            while (rp - lp < maxSize) {
                if (lp > startPage) {
                    pages.unshift(this.makePage(lp, lp + ''));
                    lp--;
                }
                if (rp < endPage) {
                    pages.push(this.makePage(rp, rp + ''));
                    rp++;
                }
            }

            if (lp > startPage) {
                pages.unshift(this.makePage(lp, '...'));
                pages.unshift(this.makePage(startPage, startPage + ''));
            } else if (lp == startPage) {
                pages.unshift(this.makePage(startPage, startPage + ''));
            }

            if (rp < endPage) {
                pages.push(this.makePage(rp, '...'));
                pages.push(this.makePage(endPage, endPage + ''));
            } else if (rp == endPage) {
                pages.push(this.makePage(endPage, endPage + ''));
            }
        }
        return pages;
    }
}
