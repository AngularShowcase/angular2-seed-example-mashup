import {Directive, ElementRef, Renderer, EventEmitter} from 'angular2/core';
import {SortOrder} from '../models/SortOrder';

@Directive({
    selector: '[hpSortable]',		 // Attribute directives go in brackts; they are css selectors
    outputs: ['sortOrder']
})
export class Sortable {

    currentSortOrder:SortOrder;
    sortOrder:EventEmitter<SortOrder>;

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        // console.log('Directive Sortable constructed.');
        this.currentSortOrder = new SortOrder('');
        this.sortOrder = new EventEmitter<SortOrder>();
    }

    processColumnClick(fieldName:string) {
        // console.log('Got a click on column ', fieldName);
        this.currentSortOrder = this.currentSortOrder.sortOnField(fieldName);
        this.sortOrder.next(this.currentSortOrder);
    }
}
