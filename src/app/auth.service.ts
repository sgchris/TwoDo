import { Injectable, EventEmitter } from '@angular/core';
import { AuthService as FBAuthService, FacebookLoginProvider } from "angular5-social-login";

@Injectable()
export class AuthService {

    user;
    loggedIn = false;

    // event is emitted upon current file change
    authUpdateEvent: EventEmitter<any> = new EventEmitter();

    constructor(private fbAuthService: FBAuthService) {
        this.fbAuthService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);

            // fire event forward
            this.authUpdateEvent.emit(this.user);
        });
    }

    login() {
        return this.fbAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    logout() {
        return this.fbAuthService.signOut();
    }
}
