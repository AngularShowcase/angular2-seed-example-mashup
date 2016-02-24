import {Directive, ElementRef, Renderer} from 'angular2/core';

@Directive({
	selector: '[autocomplete]',		// Not sure why you need to put it in brackets
	inputs: ['prompt','container'],
	host: {
		'(click)': 'onClick($event)',
		'(load)': 'onLoad($event)',
		'(unload)': 'onUnload($event)',
        '(focus)' : 'onFocus($event)',
        '(focusout)' : 'onFocusOut($event)'
	}
})
export class AutoComplete {

    prompt: string;
    container: HTMLElement;

	constructor(public _element: ElementRef, public _renderer: Renderer) {
		console.log('AutoComplete directive constructed.');
	}

	onLoad($event) {
		console.log('AutoComplete onLoad for ', $event);
	}

	onUnload($event) {
		console.log('AutoComplete onUnload for ', $event);
	}

    onFocusOut($event) {
		console.log('AutoComplete onFocusOut for ', $event);
    }

    onFocus($event: FocusEvent) {
		console.log('AutoComplete onFocus for ', $event);
        this.buildUi(<HTMLInputElement>$event.srcElement);
    }

	onClick($event) {
		console.log('AutoComplete click for ', $event);
	}

    ngOnInit() {
        console.log('AutoComplete ngOnInit with prompt: ', this.prompt);
        console.log('AutoComplete ngOnInit with container: ', this.container);
    }

    buildUi(input:HTMLInputElement) {
        let x = input.offsetLeft;
        let y = input.offsetTop;

        let select:HTMLSelectElement = this._renderer.createElement(this.container, 'select');
        let option1 = this._renderer.createElement(select, 'option');
        this._renderer.createText(option1, 'my really good option one');
        let option2 = this._renderer.createElement(select, 'option');
        this._renderer.createText(option2, 'my really good option two');

        select.style.left = `${x}px`;
        select.style.top = `${y+10}px`;
        select.style.fontSize = '18pt';
        select.style.position = 'absolute';
        select.style.color = 'purple';
    }
}
