import { Injectable } from '@angular/core';
import { WebapiService } from './webapi.service';

@Injectable()
export class MetadataService {

    constructor(
        private webapiService: WebapiService
    ) { }

    get(key:string, callbackFn) {
        let promise = this.webapiService.get('get_meta_data', {key});
        if (callbackFn) {
            promise.then(r => callbackFn(r));
        }
        return promise;
    }

    set(key:string, value:any, callbackFn) {
        let promise = this.webapiService.post('set_meta_data', {key, value})
        if (callbackFn) {
            promise.then(r => callbackFn(r));
        }
        return promise;
    }
}
