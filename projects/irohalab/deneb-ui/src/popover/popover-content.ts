/**
 * All popover content component should extend this class
 */
import { afterRender, Directive } from '@angular/core';
import { UIPopoverRef } from './popover-ref';

@Directive()
export abstract class UIPopoverContent{

    protected constructor(protected popoverRef: UIPopoverRef<UIPopoverContent>) {
        afterRender(() => {
            this.popoverRef.updatePosition();
        });
    }
}
