import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from "angular5-social-login";
import { FacebookLoginProvider } from "angular5-social-login";

declare var AWS;

@Injectable()
export class GrinotesAuthService {
    user;
    accessToken;
    isLoggedIn = false;
    isAWSLoggedIn = false;

    // event is emitted upon current file change
    authUpdateEvent: EventEmitter<any> = new EventEmitter();

    constructor(private fbAuthService: AuthService) {
        this.fbAuthService.authState.subscribe((user) => {
            this.user = user;
            this.isLoggedIn = !!this.user;
            this.accessToken = user ? user.token : false;

            if (this.user && !this.isLoggedIn) {
                AWS.config.region = 'eu-central-1';

                // Add the Facebook access token to the Cognito credentials login map.
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'eu-central-1:904ba100-069f-4f70-8799-f02a4da81cab',
                    Logins: {'graph.facebook.com': this.accessToken}
                });

                this.isAWSLoggedIn = true;
                /*
                // Obtain AWS credentials
                let grinotesAuth = this;
                AWS.config.credentials.get(_ => {
                    grinotesAuth.isAWSLoggedIn = true;
                    // Access AWS resources here.
                    let params = {
                        FunctionName: "grinotes_get_files",
                        Payload: JSON.stringify({
                            fbid: grinotesAuth.user.id
                        })
                    };
                    let lambda = new AWS.Lambda();
                    lambda.invoke(params, (err, data) => {
                        console.log('err', err, 'data', data);
                    });

                });
                */
            }

            // fire event forward
            this.authUpdateEvent.emit(this.user);
        });
    }

    // check if the user is logged in, and execute the callback
    checkAuth(callbackFn) {
        // stopped here!!!
    }

    login() {
        this.fbAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    logout() {
        this.fbAuthService.signOut();
    }

}
