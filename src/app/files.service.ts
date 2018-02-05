import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';

@Injectable()
export class FilesService {
    readonly cookieName = 'twodo_selected_file_id';

    // all the files are stored here
    files = [];
    currentFile;

    // event is emitted upon current file change
    currentFileUpdateEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private configService: ConfigService
    ) {
        // load files upon creation
        let loadFilesPromise = this.loadFilesList();

        // get the stored file id
        let currentFileId = this.cookieService.get(this.cookieName);
        loadFilesPromise.then(res => {
            // if wasn't stored before, take the first file
            if (!currentFileId) {
                currentFileId = res['files'] && res['files'].length > 0 ? res['files'][0]['id'] : false;
            }

            // load file data
            if (currentFileId) {
                this.loadFileData(currentFileId);
            }
        });
    }

    loadFileData(fileId = undefined, versionId = undefined) {
        // prepare the params
        if (fileId == undefined) {
            if (this.currentFile && this.currentFile.data.id) {
                fileId = this.currentFile.data.id;
            } else {
                return;
            }
        }
        let params = {
            'file_id': fileId
        };

        // add optional version id parameter
        if (versionId != undefined) {
            //params.set('version_id', versionId);
            params['version_id'] = versionId;
        }
        // perform the request
        let getFileDataPromise = this.http.get(this.configService.API_BASE_URL + 'get_file_data.php', { params }).toPromise();

        getFileDataPromise.then(res => {
            if (res['result'] == 'ok') {
                this.currentFile = {
                    'data': res['data'],
                    'versions': res['versions'],
                    'version': 0
                };

                // broadcast the change
                this.currentFileUpdateEvent.emit(this.currentFile);
            }
        });

        return getFileDataPromise;
    }

    // load all files from the server
    loadFilesList() {
        var loadFilesPromise = this.http.get(this.configService.API_BASE_URL + 'get_files.php').toPromise();

        loadFilesPromise.then(res => {
            if (res['result'] == 'ok') {
                this.files = res['files'];
            }
        });

        return loadFilesPromise;
    }

    setCurrentFileId(fileId) {
        let loadFileDataPromise = this.loadFileData(fileId);
        loadFileDataPromise.then(res => {
            if (res['result'] == 'ok') {
                // store the selection in the cookie
                const expiresInDays = 365;
                this.cookieService.set(this.cookieName, fileId, expiresInDays);
            }

            if (res['result'] != 'ok' || fileId == 0) {
                this.currentFile = null;
            }
        });
    }

    // update current file content
    updateFileContent(newContent) {
        if (!this.currentFile) {
            return;
        }

        // prepare request parameters
        const requestUrl = this.configService.API_BASE_URL + 'add_file_version.php';
        const requestParams = new HttpParams()
            .set('file_id', this.currentFile.data.id)
            .set('content', newContent);
        const requestOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // perform the request
        let requestPromise = this.http.post(requestUrl, requestParams.toString(), requestOptions).toPromise();
        return requestPromise;
    }

    updateFileName(fileId, newFileName) {
        const url = this.configService.API_BASE_URL + 'update_file.php';

        const params = new HttpParams()
            .set('file_id', String(fileId))
            .set('name', String(newFileName));

        const headers = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // make the call
        let renameFilePromise = this.http.post(url, params.toString(), headers).toPromise();

        // update local data
        renameFilePromise.then(res => {
            if (res['result'] == 'ok') {
                // update local data
                for (let i in this.files) {
                    if (this.files[i].id == fileId) {
                        this.files[i].name = newFileName;
                    }
                }

                // update current file data, if this is it
                if (this.currentFile.data.id == fileId) {
                    this.currentFile.data.name = newFileName;

                    // broadcast the change
                    this.currentFileUpdateEvent.emit(this.currentFile);
                }
            }
        });

        return renameFilePromise;
    }

    // create new file
    createFile(newFileName) {
        const url = this.configService.API_BASE_URL + 'add_file.php';
        const params = new HttpParams().set('name', newFileName);
        const headers = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // send the request
        let addFilePromise = this.http.post(url, params.toString(), headers).toPromise();
        addFilePromise.then(res => {
            if (res['result'] == 'ok') {
                // add the new file to the list
                this.files.push({
                    id: res['file_id'],
                    name: newFileName
                });
            }
        });

        return addFilePromise;
    }

    deleteFile(fileId) {
        const url = this.configService.API_BASE_URL + 'delete_file.php';
        const params = new HttpParams().set('file_id', String(fileId));
        const headers = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };

        // send the request
        let deleteFilePromise = this.http.post(url, params.toString(), headers).toPromise();
        deleteFilePromise.then(res => {
            if (res['result'] == 'ok') {

                // remove the file from the local list
                let theFileIndex = -1;
                for (let i in this.files) {
                    if (this.files[i].id == fileId) {
                        theFileIndex = Number(i);
                        this.files.splice(theFileIndex, 1);
                        break;
                    }
                }

                // check if current file deleted
                if (this.currentFile.data.id == fileId) {
                    if (theFileIndex > 0) {
                        // load one file before
                        this.setCurrentFileId(this.files[theFileIndex - 1].id);
                    } else if (this.files.length > 0) {
                        // load the first file
                        this.setCurrentFileId(this.files[0].id);
                    } else {
                        // don't load file
                        this.setCurrentFileId(0);
                    }
                }
            }
        });

        return deleteFilePromise;
    }

}
