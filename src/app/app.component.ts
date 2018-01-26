import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'TwoDo';

    // param to "editor" component
    selectedFileId = false;

    fileSelected(fileSelected) {
        this.selectedFileId = fileSelected;
    }
}
