import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { WebapiService } from './webapi.service';
import { TwodoAuthService } from './twodo-auth.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class FilesService {
    readonly cookieName = 'twodo_selected_file_id';

    // all the files are stored here
    files = [];
    currentFile;

    // event is emitted upon current file change
    currentFileUpdateEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private cookieService: CookieService,
        private configService: ConfigService,
        private webapi: WebapiService,
        private authService: TwodoAuthService,
        private metadataService: MetadataService
    ) {
        this._loadFilesUnauthorized();

        this.authService.authUpdateEvent.subscribe(user => {
            this._loadFilesAuthorized();
        })
    }

    // initialize the service for unauthorized users
    // everything through localStorage
    _loadFilesUnauthorized() {
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

    _loadFilesAuthorized() {
        console.log('load files authorized');
        // load files (with auth user already)
        let loadFilesPromise = this.loadFilesList();

        // get the stored file id
        let currentFileId = this.metadataService.get(this.cookieName);
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

        return this.webapi.get('get_file_data', params, res => {
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
    }

    // load all files from the server
    loadFilesList() {
        return this.webapi.get('get_files', {}, res => {
            if (res['result'] == 'ok') {
                this.files = res['files'];
            }
        });
    }

    setCurrentFileId(fileId) {
        this.loadFileData(fileId).then(res => {
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

        return this.webapi.post('add_file_version', {
            file_id: this.currentFile.data.id,
            content: newContent
        });
    }

    updateFileName(fileId, newFileName) {
        return this.webapi.post('update_file', {file_id: String(fileId), name: String(newFileName)}, res => {
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
    }

    // create new file
    createFile(newFileName) {
        return this.webapi.post('add_file', {name: newFileName}, res => {
            if (res['result'] == 'ok') {
                // add the new file to the list
                this.files.push({
                    id: res['file_id'],
                    name: newFileName
                });
            }
        });
    }

    deleteFile(fileId) {
        return this.webapi.post('delete_file', {file_id: String(fileId)}, res => {
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
    }

}
