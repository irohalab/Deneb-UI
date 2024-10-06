import { Component } from '@angular/core';
import {
    ResponsiveGenerateSrcService,
    RoundGenerateSrcService,
    SRC_GENERATOR_SERVICE
} from '../../../../irohalab/deneb-ui/src';

@Component({
    selector: 'app-responsive-image',
    templateUrl: './responsive-image.component.html',
    styleUrl: './responsive-image.component.less',
    providers: [
        // {provide: SRC_GENERATOR_SERVICE, useClass: ResponsiveGenerateSrcService},
        {provide: SRC_GENERATOR_SERVICE, useClass: RoundGenerateSrcService}
    ]
})
export class ResponsiveImageComponent {

}
