// Optional is unused here but in order to emit declaration files, we need to import it.
// https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-244448079
import {
    Optional,
    ApplicationRef,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector,
    Type, ViewContainerRef, createComponent
} from '@angular/core';
import {UIDialogRef} from './dialog-ref';
import {UIDialogContainer} from './dialog-container';
import {DialogInjector} from './dialog-injector';

@Injectable()
export class UIDialog {
    constructor(
        private _appRef: ApplicationRef,
        private _injector: Injector
    ) {}

    open<T>(component: Type<T>, config: UIDialogConfig, viewContainer?: ViewContainerRef): UIDialogRef<T> {
        let container: ComponentRef<UIDialogContainer>;
        if (viewContainer) {
            container = viewContainer.createComponent<UIDialogContainer>(UIDialogContainer, {injector: this._injector});
        } else {
            const environmentInjector = this._appRef.injector;
            container = createComponent<UIDialogContainer>(UIDialogContainer, {environmentInjector});
            this._appRef.attachView(container.hostView);
            document.body.appendChild(this.getComponentRootNode(container));
        }
        container.instance.dialogConfig = config;
        container.instance.insideParent = !!viewContainer;
        return this.createDialogContent(component, container, config);
    }

    createDialogContent<T>(component: Type<T>, containerRef: ComponentRef<UIDialogContainer>, config: UIDialogConfig): UIDialogRef<T> {
        let dialogRef = new UIDialogRef<T>(containerRef, this._appRef, config);
        let dialogInjector = new DialogInjector(dialogRef, this._injector);
        let componentRef = dialogRef.attachComponent(component, dialogInjector);
        dialogRef.componentInstance = componentRef.instance;
        return dialogRef;
    }

    /** Gets the root HTMLElement for an instantiated component. */
    private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}

export class UIDialogConfig {
    // stickyDialog means it cannot be closed through click on the backdrop or press escape key.
    stickyDialog: boolean = false;
    backdrop: boolean = true;
}
