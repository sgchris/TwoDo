import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prettyFileSize'
})
export class PrettyFileSizePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const oneMega = 1024 * 1024;
        const oneKilo = 1024;

        let units = 'Bytes';
        if (value > oneMega) {
            value = (value / oneMega).toFixed(2);
            units = 'MB';
        } else if (value > oneKilo) {
            value = (value / oneKilo).toFixed(2);
            units = 'KB';
        }

        return value + ' ' + units;
    }

}
