
import {fromEvent as observableFromEvent,  Subscription } from 'rxjs';

import {skip} from 'rxjs/operators';
import { AfterViewInit, Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Popover } from '../register';
import { UIPopoverRef } from '../popover-ref';
import { UIPopoverContent } from '../popover-content';
import { DARK_THEME, DarkThemeService } from '../../dark-theme.service';
import { NgClass, NgIf } from '@angular/common';

@Popover('ui-basic')
@Component({
    selector: 'ui-basic-popover',
    templateUrl: './basic-popover.html',
    styleUrls: ['./basic-popover.less'],
    imports: [NgClass, NgIf]
})
export class BasicPopoverComponent extends UIPopoverContent implements AfterViewInit, OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input()
    title: string;

    @Input()
    content: string;

    @Input()
    clickToClose: boolean;

    @Input()
    triggeredBy: 'click' | 'alwaysOn' = 'click';

    @HostBinding('style.zIndex')
    zIndex: number;

    placement: string;

    @HostBinding('class.inverted')
    isDarkTheme: boolean = false;

    constructor(popoverRef: UIPopoverRef<BasicPopoverComponent>, private _darkThemeService: DarkThemeService) {
        super(popoverRef);
        this.placement = this.popoverRef.placement;
        switch (this.placement) {
            case 'auto':
            case 'auto-start':
            case 'auto-end':
            case 'left-start':
            case 'left-end':
            case 'right-start':
            case 'right-end':
                const warningMessage= `This popover content component doesn\'t support the ${this.placement} placement`;
                if (console.warn) {
                    console.warn(warningMessage);
                } else {
                    console.log(warningMessage);
                }
                break;
            default:
                // otherwise this is fine.
        }
    }

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe(theme => {this.isDarkTheme = theme === DARK_THEME})
        );
    }

    @HostListener('click', ['$event'])
    onPopoverClick(event: Event) {
        if (this.clickToClose) {
            event.stopPropagation();
        }
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.clickToClose) {
            let skipCount = this.triggeredBy === 'click' ? 1: 0;
            this._subscription.add(
                observableFromEvent(document.body, 'click').pipe(
                    skip(skipCount))
                    .subscribe(() => {
                        this.popoverRef.close();
                    })
            );
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

}
