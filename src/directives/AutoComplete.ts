import {Directive, ElementRef, Renderer, Input} from 'angular2/core';

export interface ITextCompletionChoices {
    () : string[];
}

@Directive({
	selector: '[autocomplete]',		// Not sure why you need to put it in brackets
	inputs: ['prompt', '[completion]:completionFunc'],
	host: {
		'(click)': 'onClick($event)',
		'(input)': 'onInput($event)',
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
    body:HTMLBodyElement;

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
        this.removeUi();
    }

    onFocus($event: FocusEvent) {
		console.log('AutoComplete onFocus for ', $event);
        this.buildUi(<HTMLInputElement>$event.srcElement);
    }

	onClick($event) {
		console.log('AutoComplete click for ', $event);
	}

    ngOnInit() {
        // console.log('AutoComplete ngOnInit with prompt: ', this.prompt);
        // console.log('AutoComplete with completion:', this.completion);
    }

    onInput($event) {
        let text:string = $event.srcElement.value.toLowerCase();
        let matchingItems = this.allChoices.filter(choice => choice.toLowerCase().indexOf(text) >= 0);
        this.createList(matchingItems);
    }

    buildUi(input:HTMLInputElement) {

        let r = input.getBoundingClientRect();

        let x = r.left;
        let y = r.top;

        this.body = this.findBody(input);

        this.listRoot = this._renderer.createElement(this.body, 'ul');

        this.listRoot.style.left = `${x}px`;
        this.listRoot.style.top = `${y+20}px`;
        this.listRoot.style.fontSize = '12pt';
        this.listRoot.style.position = 'absolute';
        this.listRoot.style.color = 'black';
        this.listRoot.style.listStyle = 'none';

        this.allChoices = this.completion();
        this.createList(this.allChoices);
    }

    removeUi() {
        if (this.body && this.listRoot) {
            this.body.removeChild(this.listRoot);
        }
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
        let textElement:HTMLElement = this._renderer.createText(listItem, text);
        textElement.onclick = (el) => {
            console.log('You clicked on ', el);
        };
    }

    clearList() {
        if (this.listRoot) {
            while (this.listRoot.firstChild) {
                this.listRoot.removeChild(this.listRoot.firstChild);
            }
        }
    }


    findBody(from:HTMLElement) : HTMLBodyElement {
        if (!from) {
            throw Error('Cannot find the body tag');
        }

        if (from.tagName === 'BODY') {
            return <HTMLBodyElement> from;
        }

        return this.findBody(from.parentElement);
    }
}
