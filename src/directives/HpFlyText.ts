import {Directive, EventEmitter, ElementRef, Renderer} from 'angular2/core';

@Directive({
	selector: 'hp-fly-text',		// Not sure why you need to put it in brackets
	properties: [
		'sourceId:source-id',
		'targetId:target-id',
		'text',
		'duration',
		'removeDelay:remove-delay',
		'removeSource:remove-source'
	],
	events: ['complete'],
	host: {
	}
})
export class HpFlyText {

	sourceId: string;
	targetId: string;
	_text: string;
	complete: EventEmitter<string>;
	duration: number = 5000;
	removeDelay: number = 1000;
	removeSource: boolean = true;

	constructor(public _element: ElementRef, public _renderer: Renderer) {
		console.log('Directive HpFlyText constructed:', this._element, this._renderer);
		this.complete = new EventEmitter();
	}

	get text() {
		return this._text;
	}

	set text(val) {
		if (this._text !== val) {
			this._text = val;
			if (this._text) {
				this.move();
			}
		}
	}

	getUniqueId(): string {
		var number: string = Math.random().toString();
		var id = 'id' + number.slice(2);
		return id;
	}
	move() {

		var startClass: string = this.getUniqueId();
		var endClass: string = this.getUniqueId();

		console.log('Remove source is:', this.removeSource ? 'true' : 'false');

		console.log(`Moving text: [${this.text}]`);
		console.log('Source id:', this.sourceId);
		console.log('Target id:', this.targetId);

		var source: HTMLElement;
		var target: HTMLElement;


		var body: HTMLElement = $('body')[0];

		//console.log(element);
		source = document.getElementById(this.sourceId);
		var sourceStyle: CSSStyleDeclaration = source.style;

		target = document.getElementById(this.targetId);
		var targetStyle: CSSStyleDeclaration = target.style;

		//console.log('source OffsetLeft,OffsetTop: ', source.offsetLeft, source.offsetTop);
		//console.log('target OffsetLeft,OffsetTop: ', target.offsetLeft, target.offsetTop);

		//console.log(sourceStyle);

		var newElementText = `
			<div>
			<style>
				div.${startClass} {
					display:block;
					position: absolute;
					left: ${source.offsetLeft}px;
					top: ${source.offsetTop}px;
					opacity: 1.0;
					${sourceStyle.cssText}
				}
				div.${endClass} {
					display:block;
					position:absolute;
					left: ${target.offsetLeft}px;
					top: ${target.offsetTop}px;
					opacity: 0.4;
					${targetStyle.cssText}
          			transition: all ${this.duration}ms ease-in-out;
				}
			</style>
			<div class='${startClass}'>${this.text}</div>
			</div>`;

		if (this.removeSource) {
			source.hidden = true;
		}

		//console.log(newElementText);
		var newElement = $(newElementText);
		var newNode: HTMLElement = newElement[0];
		body.appendChild(newNode);

		setTimeout(() => {
			$('.' + startClass)['removeClass'](startClass).addClass(endClass);
			setTimeout(() => {
				body.removeChild(newNode);
				this.complete.next('done');
			}, this.duration + this.removeDelay);
		}, 1);
	}
}
