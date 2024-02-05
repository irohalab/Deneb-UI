import { ApplicationRef, createComponent, Injectable, Injector, Type } from '@angular/core';
import { UIPopoverInjector } from './popover-injector';
import { UIPopoverRef } from './popover-ref';
import { registry } from './register';
import Popper from 'popper.js';

@Injectable()
export class UIPopover {
    constructor(
        private _appRef: ApplicationRef,
        private _injector: Injector
    ) {}

    createPopover<T>(refElement: Element, PopoverComponent: Type<T>, placement: Popper.Placement = 'bottom-end') {
        let popoverRef = new UIPopoverRef<T>(this._appRef, placement);
        let popoverInjector = new UIPopoverInjector(popoverRef, this._injector);
        let componentRef = createComponent(PopoverComponent, {
            environmentInjector: this._appRef.injector,
            elementInjector: popoverInjector
        });
        popoverRef.attach(refElement, componentRef);
        return popoverRef;
    }

    createPopoverFromRegistry(refElement: Element, registeredPopover: string, placement?: Popper.Placement) {
        let popoverComponentClass = registry.get(registeredPopover);
        if (!popoverComponentClass) {
            throw new Error('popover not registered');
        }
        return this.createPopover(refElement, popoverComponentClass, placement);
    }
}
