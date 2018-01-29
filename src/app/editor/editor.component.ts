import { Component, OnInit, Renderer, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Config from '../config';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    // elements bindings
    @ViewChild('actualContentEl') actualContentEl:ElementRef;

    // inputs
    @Input('fileId') fileId;

    // local vars
    filename = 'Unnamed'
    editFilenameInProgress = false
    actualContent = ''
    originalContent = ''
    changesMade = false;

    constructor(private http:HttpClient) { }

    ngOnInit() { }

    ngOnChanges(changes) {
        this.loadFile();
    }

    contentKeyPress(evt) {
        // Ctrl-S
        if (evt.ctrlKey && evt.key == 's') {
            evt.preventDefault();
            this.saveFile();
        }
    }

    loadFile() {
        if (!this.fileId) {
            return;
        }

        let params = new HttpParams().set('file_id', this.fileId);
        this.http.get(Config.API_BASE_URL + 'get_file_data.php', {params: params}).subscribe(res => {
            if (res['result'] == 'ok') {
                this.filename = res['data']['name'];
                this.originalContent = res['data']['content'] == '' ? '&nbsp;' : res['data']['content'];
                this.actualContent = this.originalContent;
                this.changesMade = false;

                // set the focus
                this.actualContentEl.nativeElement.focus();
            }
        });
    }

    saveFile() {
        if (!this.fileId || !this.changesMade) return;

        // prepare the new content
        const newContent = this.actualContentEl.nativeElement.innerHTML;

        // prepare request parameters
        const requestUrl = Config.API_BASE_URL + 'add_file_version.php';
        const requestParams = new HttpParams()
            .set('file_id', this.fileId)
            .set('content', newContent);
        const requestOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // perform the request
        this.http.post(requestUrl, requestParams.toString(), requestOptions).subscribe(res => {
            if (res['result'] == 'ok') {
                this.originalContent = newContent;
                this.changesMade = false;
            }
        });
    }
}
