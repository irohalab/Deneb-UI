import { Component, Input, ExistingProvider, forwardRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DARK_THEME, DarkThemeService } from '../dark-theme.service';

let nextId = 0;

export class UIToggleChange {
    constructor(
        /** The source UIToggle of the event. */
        public source: UIToggle,
        /** The new `checked` value of the UIToggle. */
        public checked: boolean) { }
}

export const UI_TOGGLE_VALUE_ACCESSOR: ExistingProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UIToggle),
    multi: true
};

@Component({
    selector: 'ui-toggle',
    templateUrl: './toggle.html',
    styleUrls: ['./toggle.less'],
    providers: [UI_TOGGLE_VALUE_ACCESSOR]
})
export class UIToggle implements ControlValueAccessor, OnInit, OnDestroy {
    private _subscription = new Subscription();
    ready = false;
    isDisabled: boolean;
    checked: boolean;

    @Input() value: any;

    @Input('id') inputId = `toggleId${nextId++}`;

    @Input()
    text: string;

    @Output()
    readonly change = new EventEmitter<UIToggleChange>();

    isDarkTheme: boolean;

    private _onChangeHandler = (_: any) => {};

    constructor(private _darkThemeService: DarkThemeService) {
    }

    ngOnInit(): void {
        this._subscription.add(
            this._darkThemeService.themeChange
                .subscribe((theme) => { this.isDarkTheme = theme === DARK_THEME})
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    toggle(): void {
        this.checked = !this.checked;
    }

    writeValue(value: any): void {
        if (typeof value === 'boolean') {
            if (!this.ready) {
                this.ready = true;
            }
            this.checked = !!value;
        }
    }

    registerOnChange(fn: any): void {
        this._onChangeHandler = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onInputChange() {
        if (!this.isDisabled) {
            this.ready =  true;
            this.toggle();
            this._onChangeHandler(this.checked);
            this.change.emit(new UIToggleChange(this, this.checked));
        }
    }
}
