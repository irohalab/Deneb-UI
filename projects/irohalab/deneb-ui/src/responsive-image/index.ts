import { NgModule } from '@angular/core';
import { UIResponsiveImage } from './responsive-image.directive';
import { UIResponsiveImageWrapper } from './responsive-image-wrapper';

@NgModule({
    imports: [UIResponsiveImage, UIResponsiveImageWrapper],
    exports: [UIResponsiveImage, UIResponsiveImageWrapper]
})
export class UIResponsiveImageModule {

}

export * from './responsive.service';
export * from './responsive-image.directive'
export * from './responsive-image-wrapper';
export * from './responsive.generate-src.service';
export * from './DI';
