import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FilesService } from '../files.service';
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
        private cookieService: CookieService,
        private filesService: FilesService
    ) {

    }

    ngOnInit() {
        this.filesService.currentFileUpdateEvent.subscribe(selectedFileData => {
            this.selectedFileId = selectedFileData.id;
        });
    }

    openFile(fileId) {
        this.filesService.setCurrentFileId(fileId);

        // close renaming form (if open)
        this.fileId_renameInProcess = false;
    }

    createFile() {
        let newFileName = prompt('New file name');
        if (!newFileName) return;

        this.filesService.createFile(newFileName);
    }

    // rename a file, and reload the list
    renameFile() {
        if (!this.newFilename || !this.fileId_renameInProcess) {
            return false;
        }

        let renameFilePromise = this.filesService.updateFileName(this.fileId_renameInProcess, this.newFilename);
        renameFilePromise.subscribe(res => {
            this.fileId_renameInProcess = false;
        });
    }

    deleteFile(fileId) {
        if (!fileId || !confirm('Delete the file?')) return;

        this.filesService.deleteFile(fileId);
    }

}
