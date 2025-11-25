import {NgModule} from '@angular/core';
import {UIDropdown} from './dropdown';
@NgModule({
    imports: [UIDropdown],
    exports: [UIDropdown]
})
export class UIDropdownModule {

}

export * from './dropdown';
