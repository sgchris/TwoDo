import { Component } from '@angular/core';
import { GrinotesAuthService } from './grinotes-auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'GriNotes';

    // param to "editor" component
    selectedFileId = false;

    constructor(public grinotesAuthService: GrinotesAuthService) { }

    fileSelected(fileSelected) {
        this.selectedFileId = fileSelected;
    }
}
