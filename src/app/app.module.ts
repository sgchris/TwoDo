import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { FilesService } from './files.service';
import { TwodoAuthService } from './twodo-auth.service';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FilesListComponent } from './files-list/files-list.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PrettyFileSizePipe } from './pretty-file-size.pipe';

import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";
import { TopbarComponent } from './topbar/topbar.component';

let configService = new ConfigService();

// social config
let authConfig = new AuthServiceConfig([{
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(configService.FACEBOOK_APP_ID)
}]);

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        FilesListComponent,
        PrettyFileSizePipe,
        TopbarComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AngularFontAwesomeModule,
        SocialLoginModule.initialize(authConfig)
    ],
    providers: [
        CookieService,
        ConfigService,
        FilesService,
        TwodoAuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
