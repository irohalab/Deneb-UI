import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { PopoverContentComponent } from './popover-content/popover-content.component';
import { UIPopover, UIPopoverDirective } from '../../../../irohalab/deneb-ui/src';

@Component({
    selector: 'popover-demo',
    templateUrl: './popover.html',
    styles: [`
        :host {
            height: 100%;
        }

        .popover-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            position: relative;
        }
        
        .popover-container > .ui.button {
            position: relative;
        }

    `],
    imports: [UIPopoverDirective]
})
export class PopoverComponent {

    @ViewChild('refButton') refButtonRef: ElementRef;
    private _popover = inject(UIPopover);

    openPopover() {
        let refButton = this.refButtonRef.nativeElement;
        console.log(refButton);
        this._popover.createPopover(refButton, PopoverContentComponent);
    }
}
