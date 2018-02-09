import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable()
export class WebapiService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    // GET requests
    get(url, params, callbackFn) {
        // prepare the URL
        const requestUrl = this.configService.API_BASE_URL + url + '.php';

        // make the request
        let promise = this.http.get(requestUrl, params).toPromise();

        // check callback
        if (callbackFn) {
            promise.then(callbackFn);
        }

        return promise;
    }

    // POST requests
    post(url, params, callbackFn) {
        // prepare the URL
        const requestUrl = this.configService.API_BASE_URL + url + '.php';

        // prepare request parameters
        let requestParams = new HttpParams();
        for (let k in params) {
            requestParams.set(k, params[k]);
        }

        // set request as form submit
        const requestOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // perform the request
        let promise = this.http.post(requestUrl, requestParams.toString(), requestOptions).toPromise();

        // check callback
        if (callbackFn) {
            promise.then(callbackFn);
        }

        return promise;
    }
}
