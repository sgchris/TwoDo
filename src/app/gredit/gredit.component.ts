import {
    Component, OnInit,
    Input, Output,
    ViewChild, ElementRef,
    EventEmitter
} from '@angular/core';

declare var document: any;

@Component({
    selector: 'app-gredit',
    templateUrl: './gredit.component.html',
    styleUrls: ['./gredit.component.css']
})
export class GreditComponent implements OnInit {
    protected _height: number = 300;
    public _content: string = '';

    constructor() { }

    // elements bindings
    @ViewChild('greditWrapper') greditWrapper: ElementRef;
    @ViewChild('greditContent') greditContent: ElementRef;

    @Input()
    get height() {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
    }

    @Input('content')
    set content(newContent) {
        const currentContent = this.greditContent.nativeElement.innerHTML;
        if (newContent != currentContent) {
            // set the new content
            this.greditContent.nativeElement.innerHTML = this._content = newContent;
            this.greditContent.nativeElement.focus();
        }
    }
    @Output('contentChange') contentChange = new EventEmitter();

    @Output('onSave') onSaveEvent = new EventEmitter();

    ngOnInit() {
        // ..
    }

    changeOccurred() {
        this.contentChange.emit(this.greditContent.nativeElement.innerHTML);
    }

    doKeyDown(evt) {
        // check Ctrl-S
        if (evt.ctrlKey && evt.key == 's') {
            evt.preventDefault();
            this.onSaveEvent.emit();
        }
    }

    doBold() {
        document.execCommand('bold', false, true);
    }
    doItalic() {
        document.execCommand('italic', false, true);
    }
    doUnderline() {
        document.execCommand('underline', false, true);
    }
    doCut() {
        document.execCommand('cut', false, true);
    }
    doCopy() {
        document.execCommand('copy', false, true);
    }
    doPaste() {
        document.execCommand('paste', false, true);
    }
    doLink() {
        document.execCommand('createLink', false, ''+window.getSelection());
    }
    doUnlink() {
        document.execCommand('unlink', false, true);
    }

}
