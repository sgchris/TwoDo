import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {
    @Output() fileSelected = new EventEmitter<number>();

    files = [{
        id: 1, name: 'file1'
    }, {
        id: 2, name: 'another_file'
    }];
    selectedFileId = false;

    constructor() { }

    ngOnInit() { }

    openFile(fileId:number) {
        this.selectedFileId = fileId;
        this.fileSelected.emit(this.selectedFileId);
        console.log('selectedFile', this.selectedFileId);
    }

}
