import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FilesListComponent } from './files-list/files-list.component';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    FilesListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
    public APIHOST:string = 'http://localhost/TwoDo/src/api/';
}
