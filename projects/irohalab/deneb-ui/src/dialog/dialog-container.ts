import {
    AfterViewInit,
    Component,
    ComponentRef,
    EventEmitter, Injector,
    Input,
    Output, Type,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation, ViewRef
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {UIDialogConfig} from './dialog';

@Component({
    selector: 'ui-dialog-container',
    templateUrl: './dialog-container.html',
    styleUrls: ['dialog-container.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('backdropState', [
            state('active', style({opacity: '1'})),
            transition('void => active', [
                style({opacity: '0'}),
                animate(200)
            ]),
            transition('active => void', [
                style({opacity: '0'}),
                animate(200)
            ])
        ])
    ]
})
export class UIDialogContainer implements AfterViewInit {

    get backdropOpacity(): number {
        if (this.dialogConfig && !this.dialogConfig.backdrop) {
            return 0;
        }
        return 1;
    }

    get backdropState(): string {
        if (this.backdropOpacity === 1) {
            return 'active';
        }
        return 'inactive'
    }

    insideParent: boolean;

    @ViewChild('backdrop', {read: ViewContainerRef}) backDropContainerRef: ViewContainerRef;

    @Input()
    dialogConfig: UIDialogConfig;

    @Output()
    close = new EventEmitter<any>();

    contentViewRef: ViewRef;

    constructor(private _viewContainerRef: ViewContainerRef) {
    }

    onClickBackDrop($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        if (!this.dialogConfig.stickyDialog) {
            this.close.emit(null);
        }
    }

    attachDialogContent<T>(componentType: Type<T>, injector: Injector): ComponentRef<T> {
        // console.log(this._viewContainer.element.nativeElement);
        const component = this._viewContainerRef.createComponent<T>(componentType, {injector});
        this.contentViewRef = component.hostView;
        return component
    }

    ngAfterViewInit(): void {
        this.backDropContainerRef.insert(this.contentViewRef)
    }
}
