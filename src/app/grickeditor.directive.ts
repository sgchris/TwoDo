import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

declare var CKEDITOR: any;

@Directive({
    selector: '[appGrickeditor]'
})
export class GrickeditorDirective {

    @Input()
    get height() {
        return this.editor ? this.editor.config.height : 0;
    }
    set height(newHeight: number) {
        if (this.editorReady) {
            if (this.editor && newHeight) {
                this.editor.resize('100%', newHeight);
            }
        } else {
            // wait for the editor to load
            if (this.editor) {
                this.editor.on('instanceReady', evt => {
                    this.editorReady = true;
                    if (this.editor && newHeight) {
                        this.editor.resize('100%', newHeight);
                    }
                });
            }
        }
    }

    @Input()
    set content(newContent: string) {
        if (this.editor) this.editor.setData(newContent);
    }
    get content(): string {
        return this.editor.getData();
    }

    // return back the editor object
    @Output() contentChange = new EventEmitter<string>();
    @Output() onSave = new EventEmitter<string>();
    @Output() onChange = new EventEmitter<string>();

    // the editor object
    private editor:any;

    // flag for instanceReady
    private editorReady:boolean = false;

    constructor(private el: ElementRef) {
        // initialize

        this.editor = CKEDITOR.replace(el.nativeElement, {
            toolbar:[
                { name: 'styles', items: [ 'Styles', 'Format', 'Source' ] },
                { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline' ] },
                { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'Undo', 'Redo' ] },
                { name: 'links', items: [ 'Link', 'Unlink' ] },
                { name: 'insert', items: [ 'Image' ] },
                { name: 'paragraph', items: [ 'BulletedList', 'Blockquote' ] },
                { name: 'tools', items: [ 'Maximize' ] }
            ]
        });

        // set the initial data
        this.editor.setData(this.content);

        // track change
        this.editor.on('change', _ => {
            let newContent = this.editor.getData();
            this.contentChange.emit(newContent);
            this.onChange.emit(this.editor.getData());
        });

        // track change
        this.editor.on('key', evt => {
            if (evt.data.keyCode == CKEDITOR.CTRL + 83) {
                this.onSave.emit(this.editor.getData());
                evt.cancel();
                return;
            }
        });
    }

}
