import { Component, OnInit, Renderer, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
    editFilenameInProgress = false
    changesMade = false;

    constructor(
        private http: HttpClient,
        private filesService: FilesService,
        private configService: ConfigService
    ) {

    }

    ngOnInit() {
        this.filesService.currentFileUpdateEvent.subscribe(selectedFileData => {
            this.changesMade = false;

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

    loadPrevVersion() {
        //this.filesService.loadFileData(this.filesService.currentFileData.id)
    }

    loadNextVersion() {
        //this.filesService.loadFileData(this.filesService.currentFileData.id)
    }

    saveFile() {
        if (!this.changesMade) return;

        // prepare the new content
        const newContent = this.actualContentEl.nativeElement.innerHTML;

        this.filesService.updateFileContent(newContent).subscribe(res => {
            if (res['result'] == 'ok') {
                this.changesMade = false;
            }
        });

    }
}
