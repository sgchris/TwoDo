import { Injectable } from '@angular/core';
import { WebapiService } from './webapi.service';

@Injectable()
export class MetadataService {

    constructor(
        private webapi: WebapiService
    ) { }

    get(key:string) {
        let that = this;
        let promise = new Promise((resolve, reject) => {
            that.webapi.run('grinotes_get_metadata', {key}, res => {
                console.log('grinotes_get_metadata', res);
                if (res['result'] == 'ok') {
                    resolve(res['value']);
                } else {
                    reject();
                }
            });
        });

        return promise;
    }

    set(key:string, value:any) {
        let that = this;
        let promise = new Promise((resolve, reject) => {
            that.webapi.run('grinotes_set_metadata', {key, value}, res => {
                if (res['result'] == 'ok') {
                    resolve();
                } else {
                    reject();
                }
            });
        });

        return promise;
    }
}
