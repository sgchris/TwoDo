import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as Globals from '../config';

@Component({
    selector: 'app-files-list',
    templateUrl: './files-list.component.html',
    styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {
    @Output() fileSelected = new EventEmitter<any>();

    files = [];
    selectedFileId = false;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        let promise = this.loadFilesList();

        // get the store file id
        let storedSelectedFileId = this.cookieService.get('twodo_selected_file_id');
        promise.subscribe(res => {
            // if wasn't stored before, take the first file
            if (!storedSelectedFileId) {
                storedSelectedFileId = res['files'] && res['files'].length > 0 ? res['files'][0]['id'] : false;
            }

            // open the stored file
            if (storedSelectedFileId) {
                this.openFile(storedSelectedFileId);
            }
        });
    }

    ngOnInit() { }

    openFile(fileId) {
        // store the selected file locally
        this.selectedFileId = fileId;

        const expiresInDays = 365;
        this.cookieService.set('twodo_selected_file_id', fileId, expiresInDays);

        // broadcast
        this.fileSelected.emit(this.selectedFileId);
    }

    createFile() {
        this.http.post(Globals.API_BASE_URL + 'add_file.php',
            new HttpParams().set('name', prompt('New file name')).toString(), {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }).subscribe(res => {
                this.loadFilesList();
            })
    }

    loadFilesList() {
        var promise = this.http.get(Globals.API_BASE_URL + 'get_files.php');

        promise.subscribe(res => {
            if (res['result'] == 'ok') {
                this.files = res['files'];
            }
        });

        return promise;
    }

}
