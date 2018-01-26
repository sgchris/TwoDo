import { Component, OnInit, Renderer, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Globals from '../config';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    // elements bindings
    @ViewChild('editFilenameEl') inputFilenameEl:ElementRef;
    @ViewChild('actualContentEl') actualContentEl:ElementRef;

    // inputs
    @Input('fileId') fileId;

    // local vars
    filename = 'Unnamed'
    editFilenameInProgress = false
    actualContent = ''
    originalContent = ''

    constructor(private http:HttpClient) { }

    ngOnInit() { }

    ngOnChanges(changes) {
        console.log('EditorComponent field id changed', this.fileId);
        this.loadFile();
    }

    setFocus(el) {
        setTimeout(() => {el.focus();});
    }

    loadFile() {
        if (!this.fileId) {
            return;
        }

        let params = new HttpParams().set('file_id', this.fileId);
        this.http.get(Globals.API_BASE_URL + 'get_file_data.php', {params: params}).subscribe(res => console.log('res', res));
        console.log('loading file', this.fileId);
    }

    editFilename() {
        // open the editor
        this.editFilenameInProgress = true;

        // set focus on the edit file name element
        this.setFocus(this.inputFilenameEl.nativeElement);
    }

    updateFilename() {
        // close the editor
        this.editFilenameInProgress = false

        // set focus on the editable area
        this.setFocus(this.actualContentEl.nativeElement);
    }

    deleteFile() {
        console.log('deleting', this.filename);
    }
}
