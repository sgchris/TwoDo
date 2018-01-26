import { Component, OnInit, Renderer } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

    title = 'Unnamed'
    editTitleInProgress = false

    actualContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    originalContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'

    constructor() {

    }

    ngOnInit() {

    }

    editTitle() {
        this.editTitleInProgress = true;

    }

    updateTitle() {
        console.log('update title to', this.title);
        this.editTitleInProgress = false
    }
}
