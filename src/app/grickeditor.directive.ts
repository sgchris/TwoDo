import { Directive, ElementRef, Input } from '@angular/core';

declare var ClassicEditor:any;

@Directive({
    selector: '[appGrickeditor]'
})
export class GrickeditorDirective {

    //@Input('content') content: string;
    @Input()
    set content(newContent:string) {
        this.editorContent = newContent;
        if (this.editor) {
            this.editor.setData(this.editorContent);
        }
    }
    get content(): string {
        return this.editorContent;
    }

    // the ediror object
    private editor: any;

    private editorContent: string = '';

    constructor(
        private el: ElementRef
    ) {
        this.initializeEditor().then(editorObj => {
            console.log('editorObj', editorObj);
            this.editor = editorObj;

            // set the initial data
            this.editor.setData(this.editorContent);
        });
    }

    // convert DIV to the classic editor
    private initializeEditor() {
        // returns promise
        return ClassicEditor.create(this.el.nativeElement, {
            height: '500px'
        });
    }

}
