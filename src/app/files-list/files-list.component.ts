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

    @ViewChild('createNewFileInput') createNewFileInput:ElementRef;

    files = [];
    selectedFileId = false;

    fileId_renameInProcess = false;
    newFilename = '';

    openDeleteConfirmation = false;
    createNewFileFormOpened = false;

    firstNoteName = 'My Note #1';
    newNoteName = 'new note name';

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

    generateRandomName() {
        return 'My note ' + Math.round(Math.random() * 99999 + 10000);
    }

    openCreateNewFileForm() {
        this.createNewFileFormOpened = true;
        setTimeout(_ => {
            this.newNoteName = this.generateRandomName();
            this.createNewFileInput.nativeElement.focus();
            this.createNewFileInput.nativeElement.select();
        })
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

    createFile(fileName?) {
        if (!fileName) {
            fileName = prompt('New file name');
        }

        if (!fileName) return;

        this.filesService.createFile(fileName).then(res => {
            // close the form
            this.createNewFileFormOpened = false

            // open the newly created file
            this.openFile(res['file_id']);
        });
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
