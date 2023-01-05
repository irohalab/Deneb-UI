
import {fromEvent as observableFromEvent, Observable, Subscription} from 'rxjs';

import {takeUntil, mergeMap, tap, filter, debounceTime} from 'rxjs/operators';
import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {isInRect} from '../core/helpers';
import { DARK_THEME, DarkThemeService } from '../dark-theme.service';

export const SCROLL_DISTANCE = 10;

@Component({
    selector: 'ui-scrollbar',
    templateUrl: 'scrollbar.html',
    styleUrls: ['scrollbar.less']
})
export class UIScrollbar implements AfterViewInit, OnChanges, OnDestroy, OnInit {

    private _subscription = new Subscription();
    private _isDrag: boolean;
    /**
     * when _isDrag is false, we need to smoothly move the scrollbarThumb to our final y position.
     * so we need to store current point position. this position may be updated by mousemove event
     */
    private _finalY: number;

    private _timer: number;

    private _dragStartOffset: number = 0;

    private _isDraging: boolean = false;

    @Input()
    contentHeight: number;

    @Input()
    set scrollPosition(percentage: number) {
        if (this._isDraging) {
            return;
        }
        if (percentage >= 0 && percentage <=1 && this.scrollbarRect && this.scrollbarThumbHeight) {
            this.updateScrollBarThumbPosition((this.scrollbarRect.height - this.scrollbarThumbHeight) * percentage);
        }
    }

    @Output()
    scrollChange = new EventEmitter<number>();

    scrollbarRect: ClientRect;

    showScrollbar: boolean;
    scrollbarThumbHeight: number;
    scrollbarThumbTop: number = 0;

    isDarkTheme: boolean;

    @ViewChild('scrollbar') scrollbar: ElementRef;

    constructor(private _darkThemeService: DarkThemeService) {
    }

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe(theme => {this.isDarkTheme = theme === DARK_THEME})
        );
    }

    ngAfterViewInit(): void {
        let scrollbar = this.scrollbar.nativeElement;
        setTimeout(() => {
            this.scrollbarRect = scrollbar.getBoundingClientRect();
            if (this.contentHeight && this.scrollbarRect.height) {
                this.determineScrollbar(this.contentHeight);
            }
        });

        this._subscription.add(
            observableFromEvent(window, 'resize').pipe(
                debounceTime(300))
                .subscribe(
                    () => {
                        this.scrollbarRect = scrollbar.getBoundingClientRect();
                        if (this.contentHeight && this.scrollbarRect.height) {
                            this.determineScrollbar(this.contentHeight);
                        }
                    }
                )
        );

        this._subscription.add(
            observableFromEvent<MouseEvent>(document.body, 'mousedown').pipe(
                filter((event: MouseEvent) => {
                    return isInRect(event.clientX, event.clientY, this.scrollbarRect);
                }),
                tap((event: MouseEvent) => {
                    this._isDraging = true;
                    event.preventDefault();
                    let scrollbarThumbOffset = this.scrollbarThumbTop + this.scrollbarRect.top;
                    this._isDrag = event.clientY > scrollbarThumbOffset && event.clientY < scrollbarThumbOffset + this.scrollbarThumbHeight;
                    if (!this._isDrag) {
                        this._finalY = event.clientY - this.scrollbarRect.top;
                        // console.log(this._finalY);
                        this.smoothScrollTo();
                        this._dragStartOffset = 0;
                    } else {
                        this._dragStartOffset = event.clientY - scrollbarThumbOffset;
                    }
                }),
                mergeMap(() => {
                    return observableFromEvent<MouseEvent>(document.body, 'mousemove').pipe(
                        takeUntil(
                            observableFromEvent<MouseEvent>(document.body, 'mouseup').pipe(
                                tap(() => {
                                    this._isDraging = false;
                                    this._dragStartOffset = 0;
                                    clearTimeout(this._timer);
                                }))
                        ));
                }),)
                .subscribe(
                    (event: MouseEvent) => {
                        if (this._isDrag) {
                            this.updateScrollBarThumbPosition(event.clientY - this.scrollbarRect.top);
                            this.scrollTo(event.clientY - this.scrollbarRect.top);
                        } else {
                            this._finalY = event.clientY - this.scrollbarRect.top;
                            if (!isInRect(event.clientX, event.clientY, this.scrollbarRect)) {
                                clearTimeout(this._timer);
                            } else {
                                this.smoothScrollTo();
                            }
                        }
                    }
                )
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('contentHeight' in changes && changes['contentHeight'].currentValue) {
            setTimeout(() => {
                this.scrollbarRect = this.scrollbar.nativeElement.getBoundingClientRect();
                this.determineScrollbar(changes['contentHeight'].currentValue);
            });
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    private smoothScrollTo() {
        window.clearTimeout(this._timer);
        this._timer = window.setTimeout(() => {
            if (this._finalY >= this.scrollbarThumbTop && this._finalY <= this.scrollbarThumbTop + this.scrollbarThumbHeight) {
                return;
            }
            let offset = this._finalY > this.scrollbarThumbTop + this.scrollbarThumbHeight ? this._finalY - this.scrollbarThumbTop + this.scrollbarThumbHeight : this._finalY - this.scrollbarThumbTop;
            let scrollDistance = Math.min(SCROLL_DISTANCE, Math.abs(offset));
            let scrollY = offset > 0 ? this.scrollbarThumbTop + scrollDistance : this.scrollbarThumbTop - scrollDistance;
            this.updateScrollBarThumbPosition(scrollY);
            this.scrollTo(scrollY);
            this.smoothScrollTo();
        }, 20);
    }

    private updateScrollBarThumbPosition(pos: number) {
        let scrollbarAvailableHeight = (this.scrollbarRect.height - this.scrollbarThumbHeight);
        this.scrollbarThumbTop = Math.max(0, Math.min(pos - this._dragStartOffset, scrollbarAvailableHeight));
    }

    private determineScrollbar(contentHeight: number) {
        this.scrollbarThumbHeight = Math.floor(this.scrollbarRect.height / contentHeight * this.scrollbarRect.height);
        this.showScrollbar = this.scrollbarThumbHeight < this.scrollbarRect.height;
    }

    private scrollTo(pos: number) {
        let scrollbarAvailableHeight = this.scrollbarRect.height - this.scrollbarThumbHeight;
        let scrollPercentage = Math.max(0, Math.min((pos - this._dragStartOffset) / scrollbarAvailableHeight, 1));
        this.scrollChange.emit(scrollPercentage);
    }
}
