import {Directive, ElementRef, Renderer, EventEmitter} from 'angular2/angular2';

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
