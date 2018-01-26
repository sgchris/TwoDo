import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Globals from '../config';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {
    @Output() fileSelected = new EventEmitter<any>();

    files = [{
        id: 1, name: 'file1'
    }, {
        id: 2, name: 'another_file'
    }];
    selectedFileId = false;

    constructor(private http:HttpClient) {
        this.loadFilesList();
    }

    ngOnInit() { }

    openFile(fileId) {
        // store the selected file locally
        this.selectedFileId = fileId;

        // broadcast
        this.fileSelected.emit(this.selectedFileId);
    }

    loadFilesList() {
        this.http.get(Globals.API_BASE_URL + 'get_files.php').subscribe(res => console.log('res', res));
    }

}
