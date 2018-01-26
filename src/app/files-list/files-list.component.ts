import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

    files = [{
        id: 1, name: 'file1'
    }, {
        id: 2, name: 'another_file'
    }];
    selectedFile = false;

    constructor() { }

    ngOnInit() { }

    openFile(fileId:number) {
        this.selectedFile = fileId;
        console.log('selectedFile', this.selectedFile);
    }

}
