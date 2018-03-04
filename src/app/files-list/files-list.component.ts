import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FilesService } from '../files.service';
import { ConfigService } from '../config.service';

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

    openDeleteConfirmation = false;

    firstNoteName = 'My Note #1';

    constructor(
        private cookieService: CookieService,
        public filesService: FilesService,
        public configService: ConfigService
    ) {


    }

    ngOnInit() {
        this.filesService.currentFileUpdateEvent.subscribe(selectedFile => {
            this.selectedFileId = selectedFile.data.id;
        });
    }

    openFile(fileId) {
        // discard current changes
        if (this.filesService.currentFile &&
            this.filesService.currentFile.changesMade &&
            !confirm('Changes made. Discard?')) {
            return;
        }

        this.filesService.setCurrentFileId(fileId);

        // close renaming form (if open)
        this.fileId_renameInProcess = false;
    }

    createFile(newFileName?) {
        if (!newFileName) {
            newFileName = prompt('New file name');
        }

        if (!newFileName) return;

        this.filesService.createFile(newFileName);
    }

    // rename a file, and reload the list
    renameFile() {
        if (!this.newFilename || !this.fileId_renameInProcess) {
            return false;
        }

        this.filesService.updateFileName(this.fileId_renameInProcess, this.newFilename).then(_ => {
            this.fileId_renameInProcess = false;
        });
    }

    deleteFile(fileId) {
        if (!fileId) return;

        this.filesService.deleteFile(fileId);
    }

}
