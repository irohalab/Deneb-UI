/**
 * All popover content component should extend this class
 */
import { AfterViewInit, Directive } from '@angular/core';
import { UIPopoverRef } from './popover-ref';

@Directive()
export abstract class UIPopoverContent implements AfterViewInit {

    protected constructor(protected popoverRef: UIPopoverRef<UIPopoverContent>) {}

    ngAfterViewInit(): void {
        this.popoverRef.updatePosition();
    }
}
