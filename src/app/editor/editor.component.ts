import { Component, OnInit, Renderer, ViewChild, Input, ElementRef } from '@angular/core';
import { FilesService } from '../files.service';
import { ConfigService } from '../config.service';


@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

    // elements bindings
    @ViewChild('actualContentEl') actualContentEl: ElementRef;

    // inputs
    @Input('fileId') fileId;

    // local vars
    filename = 'Unnamed'

    // 0 - latest, N - N versions back
    currentVersion = 0;
    editFilenameInProgress = false
    contentHasHebrewLetters = false;

    constructor(
        public configService: ConfigService,
        public filesService: FilesService
    ) {
    }

    ngOnInit() {
        this.filesService.currentFileUpdateEvent.subscribe(selectedFile => {
            if (this.filesService.currentFile) {
                this.filesService.currentFile.changesMade = false;
            }

            if (this.currentVersion === null) {
                this.currentVersion = Number(selectedFile.data.total_versions) - 1;
            }

            // set the focus
            if (this.actualContentEl) {
                this.actualContentEl.nativeElement.focus();
            }
        });
    }

    _loadFileAtCurrentVersion() {
        if (!this.filesService.currentFile) {
            return;
        }

        const fileId = this.filesService.currentFile.data.id;
        const prevVersionId = this.filesService.currentFile.versions[this.currentVersion].id;
        this.filesService.loadFileData(fileId, prevVersionId);
    }

    loadPrevVersion() {
        if (!this.filesService.currentFile) {
            return;
        }

        if (this.filesService.currentFile.changesMade &&
            !confirm('Changes made, discard?')) {
            return;
        }

        // check if reached the first version
        if (++this.currentVersion > this.filesService.currentFile.data.total_versions - 1) {
            this.currentVersion = this.filesService.currentFile.data.total_versions - 1;
        }

        this._loadFileAtCurrentVersion();
    }

    loadNextVersion() {
        if (!this.filesService.currentFile) {
            return;
        }

        if (this.filesService.currentFile.changesMade && !confirm('Changes made, discard?')) {
            return;
        }

        if (--this.currentVersion <= 0) {
            this.currentVersion = 0;
        }

        this._loadFileAtCurrentVersion();
    }

    loadLatestVersion() {
        if (!this.filesService.currentFile) {
            return;
        }

        if (this.filesService.currentFile.changesMade && !confirm('Changes made, discard?')) {
            return;
        }

        // reset to the latest
        this.currentVersion = 0;

        this._loadFileAtCurrentVersion();
    }

    // when editor content changes
    onChangeCallback() {
        if (this.filesService.currentFile) {
            this.filesService.currentFile.changesMade = true;
        }
    }

    saveFile() {
        if (!this.filesService.currentFile) {
            return;
        }

        if (!this.filesService.currentFile.changesMade) {
            return;
        }

        // prepare the new content
        const newContent = this.filesService.currentFile.data.content;
        if (newContent === false) {
            alert('Cannot get data from the editor');
            return;
        }

        this.filesService.updateFileContent(newContent).then(res => {
            if (res['result'] == 'ok') {
                this.filesService.currentFile.changesMade = false;
                this.currentVersion = 0;

                this.filesService.loadFilesList();
            }
        });

    }
}
