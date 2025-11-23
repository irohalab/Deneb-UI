import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DARK_THEME, DarkThemeService } from '../../../../irohalab/deneb-ui/src';
@Component({
    selector: 'timeline-meter-demo',
    templateUrl: './timeline-meter.html',
    styles: [
        `
            ui-timeline-meter {
                display: block;
                width: 200px;
                height: 300px;
            }
            .demo-card {
                width: 100%;
                font-size: 16px;
            }
            .demo-card.dark-theme {
                color: #ffffff;
            }
        `
    ],
    standalone: false
})
export class TimelineMeterExample implements OnInit, OnDestroy {
    private _subscription = new Subscription();
    cards: string[];
    timestampList: number[];

    newPosition: number;

    isDarkTheme: boolean;

    constructor(private _darkThemeService: DarkThemeService) {
    }


    onScrollPositionChange(p: number) {
        console.log(p);
    }

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe(theme => {this.isDarkTheme = theme === DARK_THEME})
        );

        this.newPosition = 2000;
        setTimeout(() => {
            let timestamp = Date.now();
            this.timestampList = [];
            this.cards = [];
            for(let i = 0; i < 100; i++) {
                this.cards.push(i + '');
                this.timestampList.push(timestamp);
                timestamp = Math.floor(timestamp - 3600 * 1000 * 24 * 30 * Math.random() * 3);
            }
        }, 2000);

        // setTimeout(() => {
        //     this.timestampList = [];
        //     this.cards = [];
        // }, 4000);
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
