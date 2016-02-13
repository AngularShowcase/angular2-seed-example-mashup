import {Directive, EventEmitter, ElementRef, Renderer} from 'angular2/core';

@Directive({
	selector: '[hp-drag]',		// Not sure why you need to put it in brackets
	events: ['dragging'],
	host: {
		'(drag)': 'onDrag($event)'
	}

})
export class HpDrag {

	dragging: EventEmitter<any>;

	constructor(private _element: ElementRef, private _renderer: Renderer) {
		console.log('Directive constructed:', this._element, this._renderer);
		this.dragging = new EventEmitter();
	}

	onDrag(ev) {
		this.dragging.next(ev);
	}
}
