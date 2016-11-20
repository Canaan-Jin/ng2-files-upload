import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import{FileUpLoader}from'./modules/file-uploader.class';

@Directive({
    selector: '[fileSelect]'
})
export class FileSelectDirective {
    @Input('fileSelect') upLoader: FileUpLoader;
    private element: ElementRef;
    constructor(element: ElementRef) {
        this.element = element;
    }
    @HostListener('change')
    public onChange(): any {
        this.upLoader.addFiles(this.element.nativeElement.files[0]);
    }
}