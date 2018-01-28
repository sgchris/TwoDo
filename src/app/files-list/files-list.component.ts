import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

    constructor(private http: HttpClient) {
        this.loadFilesList();
    }

    ngOnInit() { }

    openFile(fileId) {
        // store the selected file locally
        this.selectedFileId = fileId;

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
        this.http.get(Globals.API_BASE_URL + 'get_files.php').subscribe(res => {
            if (res['result'] == 'ok') {
                this.files = res['files'];
            }
        });
    }

}
