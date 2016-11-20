import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FileSelectDirective } from './directive/file-select.directive';
@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    FileSelectDirective
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }