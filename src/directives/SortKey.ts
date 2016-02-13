import {Directive, ElementRef, Renderer} from 'angular2/core';
import {Sortable} from './Sortable';

// This directive works in conjunction with its parent Sortable directive.  It informs the
// parent directive that the <th> was clicked and passes it the sort key.  The parent directive
// keeps track of the current sort order and emits sort order changes.

@Directive({
    selector: '[hpSortKey]',		 // attribute directives go in brackets (they are css selectors)
    inputs: ['sortKey:hpSortKey'],
    host: {
        '(click)': 'onClick($event)'
    }
})
export class SortKey {

    sortKey:string;

    constructor(public _element: ElementRef, public _renderer: Renderer, public parent:Sortable) {
        // console.log('Directive SortKey constructed.');
        // console.log('Injected parent is ', parent);
    }

    ngOnInit() {
        // console.log(`sortKey = ${this.sortKey} in ngOnInit in SortKey directive`);
    }

    onClick($event) {
        this.parent.processColumnClick(this.sortKey);
    }
}
