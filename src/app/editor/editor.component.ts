import { Component, OnInit, OnChange, Renderer, ViewChild, Input } from '@angular/core';

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
    @Input('fileId') fileId:number;

    // local vars
    filename = 'Unnamed'
    editFilenameInProgress = false
    actualContent = ''
    originalContent = ''

    constructor() {
        console.log('constructor', this.fileId);
    }

    ngOnInit() { }

    ngOnChanges(changes) {
        console.log('ngOnChanges changes', changes);
        console.log('ngOnChanges fileId', this.fileId);
    }

    setFocus(el) {
        setTimeout(() => {el.focus();});
    }

    loadFile() {
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
