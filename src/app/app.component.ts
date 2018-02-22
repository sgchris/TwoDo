import { Component } from '@angular/core';
import { TwodoAuthService } from './twodo-auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'TwoDo';

    // param to "editor" component
    selectedFileId = false;

    constructor(public twodoAuthService: TwodoAuthService) { }

    fileSelected(fileSelected) {
        this.selectedFileId = fileSelected;
    }
}
