import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { GrinotesAuthService } from './grinotes-auth.service';

@Injectable()
export class WebapiService {

    inProgress = false;

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private authService: GrinotesAuthService
    ) { }

    // GET requests
    get(url, params = {}, callbackFn = undefined) {
        this.inProgress = true;

        // add authentication token
        if (this.authService.isLoggedIn && this.authService.accessToken) {
            params['access_token'] = this.authService.accessToken;
        }

        // prepare the URL
        const requestUrl = this.configService.API_BASE_URL + url + '.php';

        // make the request
        let promise = this.http.get(requestUrl, { params }).toPromise();

        promise.then(res => this.inProgress = false)

        // check callback
        if (callbackFn) {
            promise.then(callbackFn);
        }

        return promise;
    }

    // POST requests
    post(url, params = {}, callbackFn = undefined) {
        this.inProgress = true;

        // add authentication token
        if (this.authService.isLoggedIn && this.authService.accessToken) {
            params['access_token'] = this.authService.accessToken;
        }

        // prepare the URL
        const requestUrl = this.configService.API_BASE_URL + url + '.php';

        // prepare request parameters
        let requestParams = new HttpParams({
            fromObject: params
        });

        // set request as form submit
        const requestOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // perform the request
        let promise = this.http.post(requestUrl, requestParams.toString(), requestOptions).toPromise();

        promise.then(res => this.inProgress = false)

        // check callback
        if (callbackFn) {
            promise.then(callbackFn);
        }

        return promise;
    }
}
