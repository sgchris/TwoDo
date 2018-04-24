import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { WebapiService } from './webapi.service';
import { GrinotesAuthService } from './grinotes-auth.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class FilesService {
    readonly currentFile_keyName = 'grinotes_selected_file_id';
    readonly hebrewLetters = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת';

    // all the files are stored here
    files = [];
    public currentFile;

    get _currentFile() {
        console.log('getting current file');
        return this.currentFile;
    }

    // event is emitted upon current file change
    currentFileUpdateEvent: EventEmitter<any> = new EventEmitter();
    filesLoadedEvent: EventEmitter<any> = new EventEmitter();
    initialFilesListLoaded = false;

    constructor(
        private cookieService: CookieService,
        private configService: ConfigService,
        private webapi: WebapiService,
        private authService: GrinotesAuthService,
        private metadataService: MetadataService
    ) {
        this._loadFiles();

        this.authService.authUpdateEvent.subscribe(user => {
            this.initialFilesListLoaded = false;
            this._loadFiles()
        });
    }

    _loadFiles() {
        // load files upon creation
        return this.loadFilesList().then(res => {
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
        }).then(_ => {
            this.initialFilesListLoaded = true;
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
            'fileid': fileId
        };

        // add optional version id parameter
        if (versionId != undefined) {
            //params.set('version_id', versionId);
            params['versionid'] = versionId;
        }

        let that = this;
        let promise = new Promise((resolve, reject) => {
            this.webapi.run('grinotes_get_file', params, res => {
                if (res['result'] == 'ok') {
                    resolve({
                        'data': res['data'],
                        'versions': res['versions'],
                        'version': 0,
                        'hasHebrewLetters': this._contentHasHebrewLetters(res['data'].content)
                    });
                } else {
                    reject();
                }
            });
        });

        promise.then(currentFileParam => {
            this.currentFile = currentFileParam;
            this.currentFileUpdateEvent.emit(currentFileParam);
        });

        return promise;
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
        let that = this;
        let promise = new Promise((resolve, reject) => {
            that.webapi.run('grinotes_get_files', {}, res => {
                if (res['result'] == 'ok') {
                    that.files = res['files'];
                    resolve(that.files);
                } else {
                    reject();
                }
            });
        });

        promise.then(res => {
            that.filesLoadedEvent.emit(that.files);
        });

        return promise;
    }

    setCurrentFileId(fileId) {
        let loadFileSucceeded = this.loadFileData(fileId)
        if (loadFileSucceeded) {
            loadFileSucceeded.then(res => {
                if (res && res['data']) {
                    console.log ('metadata service causes troubles');
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
        let that = this;
        let promise = new Promise((resolve, reject) => {
            that.webapi.run('grinotes_add_file', {name: newFileName}, res => {
                if (res['result'] == 'ok') {
                    // add the new file to the list
                    that.files.push({
                        id: res['file_id'],
                        name: newFileName
                    });
                    resolve(that.files);
                } else {
                    reject();
                }
            });
        });

        return promise;
    }

    deleteFile(fileId) {
        let that = this;
        console.log('fileId', fileId);
        let promise = new Promise((resolve, reject) => {
            that.webapi.run('grinotes_delete_file', {file_id: fileId}, res => {
                if (res['result'] == 'ok') {

                    // remove the file from the local list
                    let theFileIndex = -1;
                    for (let i in that.files) {
                        if (that.files[i].id == fileId) {
                            theFileIndex = Number(i);
                            that.files.splice(theFileIndex, 1);
                            break;
                        }
                    }

                    // check if current file deleted
                    if (that.currentFile.data.id == fileId) {
                        if (theFileIndex > 0) {
                            // load one file before
                            that.setCurrentFileId(that.files[theFileIndex - 1].id);
                        } else if (that.files.length > 0) {
                            // load the first file
                            that.setCurrentFileId(that.files[0].id);
                        } else {
                            // don't load file
                            that.setCurrentFileId(0);
                        }
                    }
                }
            });
        });

        return promise;
    }

}
