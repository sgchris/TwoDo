import { Component, OnInit, Renderer, ViewChild } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    @ViewChild('editFilenameEl') inputFilenameEl:ElementRef;
    @ViewChild('actualContentEl') actualContentEl:ElementRef;

    filename = 'Unnamed'
    editFilenameInProgress = false

    actualContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    originalContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'

    constructor() { }

    ngOnInit() { }

    setFocus(el) {
        setTimeout(() => {el.focus();});
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
