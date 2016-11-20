import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FileSelectDirective } from './file-select.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [FileSelectDirective],
    exports: [FileSelectDirective]

})
export class FileUpLoadModule {

}