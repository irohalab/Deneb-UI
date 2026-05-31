import { provideZoneChangeDetection } from "@angular/core";
// require('semantic-ui-less/definitions/globals/reset.less');
// require('semantic-ui-less/definitions/globals/site.less');

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { App } from './app/app.component';
import { Dialog } from './app/dialog/dialog.component';
import { ToastDemo } from './app/toast/toast.component';
import { PaginationDemo } from './app/pagination/pagination.component';
import { InfiniteListDemo } from './app/infinite-list/infinite-list.component';
import { TimelineMeterExample } from './app/timeline-meter/timeline-meter.component';
import { DropdownDemo } from './app/dropdown/dropdown.component';
import { ToggleDemo } from './app/toggle/toggle.component';
import { PopoverComponent } from './app/popover/popover.component';
import { ResponsiveImageComponent } from './app/responsive-image/responsive-image.component';

bootstrapApplication(App, {
    providers: [
        provideZoneChangeDetection(),provideAnimations(),
        provideRouter([
            { path: 'dialog', component: Dialog },
            { path: 'toast', component: ToastDemo },
            { path: 'pagination', component: PaginationDemo },
            { path: 'infinite-list', component: InfiniteListDemo },
            { path: 'timeline-meter', component: TimelineMeterExample },
            { path: 'dropdown', component: DropdownDemo },
            { path: 'toggle', component: ToggleDemo },
            { path: 'popover', component: PopoverComponent },
            { path: 'responsive-image', component: ResponsiveImageComponent }
        ])
    ]
}).catch(err => console.error(err));
