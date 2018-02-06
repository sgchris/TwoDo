import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { FilesService } from './files.service';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FilesListComponent } from './files-list/files-list.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PrettyFileSizePipe } from './pretty-file-size.pipe';


@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        FilesListComponent,
        PrettyFileSizePipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AngularFontAwesomeModule
    ],
    providers: [
        CookieService,
        ConfigService,
        FilesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
