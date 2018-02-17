import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { WebapiService } from './webapi.service';
import { TwodoAuthService } from './twodo-auth.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class FilesService {
    readonly currentFile_keyName = 'twodo_selected_file_id';
    readonly hebrewLetters = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת';

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
        this._loadFiles();
        this.authService.authUpdateEvent.subscribe(user => this._loadFiles());
    }

    _loadFiles() {
        // load files upon creation
        this.loadFilesList().then(res => {
            if (res['result'] != 'ok') return false;

            if (this.authService.isLoggedIn) {
                this.metadataService.get(this.currentFile_keyName).then(metaRes => {
                    // get the last selected file ID
                    const currentFileId = (metaRes['result'] == 'ok') ? metaRes['value'] : false;
                    this.loadFileData(currentFileId);
                });
            } else {
                let currentFileId = this.cookieService.get(this.currentFile_keyName);
                this.loadFileData(currentFileId);
            }
        });
    }

    loadFileData(fileId = undefined, versionId = undefined) {
        // prepare the params
        if (!fileId) {
            if (this.currentFile && this.currentFile.data.id) {
                fileId = this.currentFile.data.id;
            }
        }

        // if no file ID, take the first file from the list
        if (!fileId) {
            fileId = this.files && this.files.length > 0 ? this.files[0].id : false;
        }

        if (!fileId) {
            return false;
        }

        // // load the file from the server

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
                    'version': 0,
                    'hasHebrewLetters': this._contentHasHebrewLetters(res['data'].content)
                };

                // broadcast the change
                this.currentFileUpdateEvent.emit(this.currentFile);
            }
        });
    }

    // check if the content parameter has hebrew letters
    _contentHasHebrewLetters(content) {
        let hebLetters = this.hebrewLetters.split('');
        let hasHebLetters = false;
        for (let i in hebLetters) {
            if (content.indexOf(hebLetters[i]) >= 0) {
                hasHebLetters = true;
                break;
            }
        }

        return hasHebLetters;
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
        let loadFileSucceeded = this.loadFileData(fileId)
        if (loadFileSucceeded) {
            loadFileSucceeded.then(res => {
                if (res['result'] == 'ok') {
                    // store the selection in the cookie
                    if (this.authService.isLoggedIn) {
                        this.metadataService.set(this.currentFile_keyName, fileId);
                    } else {
                        const expiresInDays = 365;
                        this.cookieService.set(this.currentFile_keyName, fileId, expiresInDays);
                    }
                } else {
                    this.currentFile = null;
                }
            });
        }
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
        return this.webapi.post('update_file', { file_id: String(fileId), name: String(newFileName) }, res => {
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
        return this.webapi.post('add_file', { name: newFileName }, res => {
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
        return this.webapi.post('delete_file', { file_id: String(fileId) }, res => {
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
