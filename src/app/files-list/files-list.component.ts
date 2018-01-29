import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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

    fileId_renameInProcess = false;
    newFilename = false;

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
        // close renaming form (if open)
        this.fileId_renameInProcess = false;

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
            });
    }

    // rename a file, and reload the list
    renameFile() {
        if (!this.newFilename || !this.fileId_renameInProcess) {
            return false;
        }

        const params = new HttpParams()
            .set('file_id', String(this.fileId_renameInProcess))
            .set('name', String(this.newFilename));

        this.http.post(Globals.API_BASE_URL + 'update_file.php', params.toString(), {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        }).subscribe(res => {
            if (res['result'] == 'ok') {
                this.fileId_renameInProcess = false;
                this.loadFilesList();
            }
        });
    }

    deleteFile(fileId) {
        if (!fileId || !confirm('Delete the file?')) return;

        const params = new HttpParams()
            .set('file_id', String(fileId));

        this.http.post(Globals.API_BASE_URL + 'delete_file.php', params.toString(), {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        }).subscribe(res => {
            if (res['result'] == 'ok') {
                let promise = this.loadFilesList();

                promise.subscribe(res => {
                    if (res['result'] == 'ok') {
                        if (res['files'].length > 0) {
                            this.openFile(res['files'][0]['id']);
                        }
                    }
                });
            }
        });
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
