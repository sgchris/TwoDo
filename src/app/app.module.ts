import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { WebapiService } from './webapi.service';
import { MetadataService } from './metadata.service';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angular5-social-login";
import { FilesService } from './files.service';
import { TwodoAuthService } from './twodo-auth.service';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FilesListComponent } from './files-list/files-list.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PrettyFileSizePipe } from './pretty-file-size.pipe';

import { TopbarComponent } from './topbar/topbar.component';

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { GrickeditorDirective } from './grickeditor.directive';

// FB authentication
export function getAuthServiceConfigs() {
    let configService = new ConfigService();
    return new AuthServiceConfig([{
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(configService.FACEBOOK_APP_ID)
    }]);
}

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        FilesListComponent,
        PrettyFileSizePipe,
        TopbarComponent,
        GrickeditorDirective
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AngularFontAwesomeModule,
        SocialLoginModule,
        ConfirmationPopoverModule.forRoot({})
        // with defining defaults:
        //ConfirmationPopoverModule.forRoot({})
    ],
    providers: [
        CookieService,
        ConfigService,
        WebapiService,
        MetadataService,
        FilesService,
        TwodoAuthService,
        {
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
