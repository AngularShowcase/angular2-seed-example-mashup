import {Directive, ElementRef, Renderer, Input} from 'angular2/core';

export interface ITextCompletionChoices {
    () : string[];
}

@Directive({
	selector: '[autocomplete]',		// Not sure why you need to put it in brackets
	inputs: ['prompt', '[completion]:completionFunc'],
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
    listRoot: HTMLUListElement;
    allChoices:string[] = [];

    @Input()
    completion: ITextCompletionChoices;

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
        console.log('AutoComplete with completion:', this.completion);
    }

    buildUi(input:HTMLInputElement) {

        let r = input.getBoundingClientRect();

        let x = r.left;
        let y = r.top;

        let body = this.findBody(input);

        this.listRoot = this._renderer.createElement(body, 'ul');

        this.listRoot.style.left = `${x}px`;
        this.listRoot.style.top = `${y+20}px`;
        this.listRoot.style.fontSize = '18pt';
        this.listRoot.style.position = 'absolute';
        this.listRoot.style.color = 'purple';
        this.listRoot.style.listStyle = 'none';

        this.allChoices = this.completion();
        this.createList(this.allChoices);
    }

    createList(items:string[]) {
        if (!this.listRoot) {
            return;
        }

        this.clearList();
        items.forEach(item => this.addTextToList(item));
    }

    addTextToList(text:string) {
        if (!this.listRoot) {
            return;
        }

        let listItem = this._renderer.createElement(this.listRoot, 'li');
        this._renderer.createText(listItem, text);
    }

    clearList() {
        if (this.listRoot) {
            while (this.listRoot.firstChild) {
                this.listRoot.removeChild(this.listRoot.firstChild);
            }
        }
    }

    findBody(from:HTMLElement) : HTMLElement {
        if (!from) {
            throw Error('Cannot find the body tag');
        }

        if (from.tagName === 'BODY') {
            return from;
        }

        return this.findBody(from.parentElement);
    }
}
