import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

declare var document: any;

@Component({
    selector: 'app-gredit',
    templateUrl: './gredit.component.html',
    styleUrls: ['./gredit.component.css']
})
export class GreditComponent implements OnInit {
    protected _height: number = 300;
    protected _content: string = '';

    constructor() { }

    // elements bindings
    @ViewChild('greditWrapper') greditWrapper: ElementRef;

    @Input()
    get height() {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
    }

    @Input()
    get content() {
        return this._content;
    }
    set content(newContent: string) {
        this._content = newContent;
    }

    ngOnInit() {
        // ..
    }

    doBold() {
        console.log('exec command', document.execCommand('bold', false, true));
    }
    doItalic() {
        console.log('exec command', document.execCommand('italic', false, true));
    }
    doUnderline() {
        console.log('exec command', document.execCommand('underline', false, true));
    }
    doCut() {
        console.log('exec command', document.execCommand('cut', false, true));
    }
    doCopy() {
        console.log('exec command', document.execCommand('copy', false, true));
    }
    doPaste() {
        console.log('exec command', document.execCommand('paste', false, true));
    }
    doLink() {
        console.log('exec command', document.execCommand('createLink', false, ''+window.getSelection()));
    }
    doUnlink() {
        console.log('exec command', document.execCommand('unlink', false, true));
    }

}
