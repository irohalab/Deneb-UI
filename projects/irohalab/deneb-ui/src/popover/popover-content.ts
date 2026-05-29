/**
 * All popover content component should extend this class
 */
import { afterEveryRender, Directive } from '@angular/core';
import { UIPopoverRef } from './popover-ref';

@Directive()
export abstract class UIPopoverContent{

    protected constructor(protected popoverRef: UIPopoverRef<UIPopoverContent>) {
        afterEveryRender(() => {
            this.popoverRef.updatePosition();
        });
    }
}
