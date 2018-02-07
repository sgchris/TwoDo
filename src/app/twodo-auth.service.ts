import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";

@Injectable()
export class TwodoAuthService {
    user;
    isLoggedIn = false;

    // event is emitted upon current file change
    authUpdateEvent: EventEmitter<any> = new EventEmitter();

    constructor(private fbAuthService: AuthService) {
        this.fbAuthService.authState.subscribe((user) => {
            console.log('user', user);
            this.user = user;
            this.isLoggedIn = (user != null);

            // fire event forward
            this.authUpdateEvent.emit(this.user);
        });
    }

    login() {
        this.fbAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    logout() {
        this.fbAuthService.signOut();
    }

}
