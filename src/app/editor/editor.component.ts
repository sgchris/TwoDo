import { Component, OnInit, Renderer, ViewChild } from '@angular/core';

function getCaretCharacterOffsetWithin (element) {
    let ie = (typeof document.selection != 'undefined' && document.selection.type != 'Control') && true
    let w3 = (typeof window.getSelection != 'undefined') && true
    let caretOffset = 0
    if (w3) {
      let range = window.getSelection().getRangeAt(0)
      let preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    } else if (ie) {
      let textRange = documentselection.createRange()
      let preCaretTextRange = document.body.createTextRange()
      preCaretTextRange.expand(element)
      preCaretTextRange.setEndPoint('EndToEnd', textRange)
      caretOffset = preCaretTextRange.text.length
    }
    return caretOffset;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    @ViewChild('editFilenameEl') inputFilenameEl:ElementRef;
    @ViewChild('actualContentEl') actualContentEl:ElementRef;

    caretPos = 0
    filename = 'Unnamed'
    editFilenameInProgress = false

    actualContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    originalContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'

    constructor() {

    }

    ngOnInit() {

    }

    saveCursorPosition() {
        this.caretPos = getCaretCharacterOffsetWithin(this.actualContentEl.nativeElement);
    }

    loadCursorPosition() {
        var range = document.createRange();
        var sel = window.getSelection();
        //range.setStart(el.childNodes[2], 5);
        console.log(this.actualContentEl.nativeElement.childNodes);
        range.setStart(this.actualContentEl.nativeElement.childNodes[0], this.caretPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    editFilename() {
        this.editFilenameInProgress = true;
        this.inputFilenameEl.nativeElement.focus();
    }

    updateFilename() {
        this.editFilenameInProgress = false
        this.actualContentEl.nativeElement.focus();
    }
}
