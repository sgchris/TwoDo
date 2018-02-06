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
    changesMade = false;

    constructor(
        private configService: ConfigService,
        private filesService: FilesService
    ) {

    }

    ngOnInit() {
        this.filesService.currentFileUpdateEvent.subscribe(selectedFile => {
            this.changesMade = false;

            if (this.currentVersion === null) {
                this.currentVersion = Number(selectedFile.data.total_versions) - 1;
            }

            // set the focus
            if (this.actualContentEl) {
                this.actualContentEl.nativeElement.focus();
            }
        });
    }

    // bind Ctrl-S as save
    contentKeyPress(evt) {
        // Ctrl-S
        if (evt.ctrlKey && evt.key == 's') {
            evt.preventDefault();
            this.saveFile();
        }
    }

    _loadFileAtCurrentVersion() {
        const fileId = this.filesService.currentFile.data.id;
        const prevVersionId = this.filesService.currentFile.versions[this.currentVersion].id;
        this.filesService.loadFileData(fileId, prevVersionId);
    }

    loadPrevVersion() {
        if (this.changesMade && !confirm('Changes made, discard?')) {
            return;
        }

        // check if reached the first version
        if (++this.currentVersion > this.filesService.currentFile.data.total_versions - 1) {
            this.currentVersion = this.filesService.currentFile.data.total_versions - 1;
        }

        this._loadFileAtCurrentVersion();
    }

    loadNextVersion() {
        if (this.changesMade && !confirm('Changes made, discard?')) {
            return;
        }

        if (--this.currentVersion <= 0) {
            this.currentVersion = 0;
        }

        this._loadFileAtCurrentVersion();
    }

    loadLatestVersion() {
        if (this.changesMade && !confirm('Changes made, discard?')) {
            return;
        }

        // reset to the latest
        this.currentVersion = 0;

        this._loadFileAtCurrentVersion();
    }



    saveFile() {
        if (!this.changesMade) return;

        // prepare the new content
        const newContent = this.actualContentEl.nativeElement.innerHTML;

        this.filesService.updateFileContent(newContent).then(res => {
            if (res['result'] == 'ok') {
                this.changesMade = false;
                this.currentVersion = 0;

                this.filesService.loadFileData();
            }
        });

    }
}
