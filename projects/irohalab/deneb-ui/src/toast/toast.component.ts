import {
    Component,
    EventEmitter, HostBinding,
    Input,
    OnDestroy, OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {UIToastRef} from './toast-ref';
import {UIToastAnimation} from './toast-interface';
import { DARK_THEME, DarkThemeService } from '../dark-theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ui-toast',
    template: '<div class="toast-content ui black message">{{message}}</div>',
    animations: [
        trigger('fade', [
            state('in', style({ opacity: 1 })),
            transition('void => *', [
                style({ opacity: 0 }),
                animate(300)
            ]),
            transition('* => void', [
                animate(300, style({ opacity: 0 }))
            ])
        ])
    ],
    host: {
        '[@fade]': '"in"',
        '(@fade.done)': 'uiLeaveAnimationDone($event)'
    },
    styleUrls: ['toast.less'],
    encapsulation: ViewEncapsulation.Emulated
})
export class UIToastComponent implements OnInit, OnDestroy, UIToastAnimation {
    private _subscription = new Subscription();
    @Input() message: string;

    @Output()
    animationEvent = new EventEmitter<any>();

    @HostBinding('class.dark-theme')
    isDarkTheme: boolean;

    constructor(private _toastRef: UIToastRef<UIToastComponent>,
                private _darkThemeService: DarkThemeService) {}

    public ngOnInit() {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe((theme) => { this.isDarkTheme = theme === DARK_THEME; })
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    uiLeaveAnimationDone(event: AnimationEvent): void {
        if (event.toState === 'void') {
            this.animationEvent.emit(null);
        }
    }
}
