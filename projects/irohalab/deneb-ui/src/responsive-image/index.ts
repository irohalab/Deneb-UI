import { NgModule } from '@angular/core';
import { UIResponsiveImage } from './responsive-image.directive';
import { UIResponsiveService } from './responsive.service';
import { UIResponsiveImageWrapper } from './responsive-image-wrapper';

@NgModule({
    declarations: [UIResponsiveImage, UIResponsiveImageWrapper],
    providers: [UIResponsiveService],
    exports: [UIResponsiveImage, UIResponsiveImageWrapper]
})
export class UIResponsiveImageModule {

}

export * from './responsive.service';
export * from './responsive-image.directive'
export * from './responsive-image-wrapper';
