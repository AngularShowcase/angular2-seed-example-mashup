import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'yes-no',
    outputs: ['yes','no','answer'],
    templateUrl: './common/components/YesNo.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    styleUrls: ['./common/components/YesNo.css']
})
export class YesNo {
    yes:EventEmitter<string>;
    no:EventEmitter<string>;
    answer:EventEmitter<string>;

    constructor() {
        this.yes = new EventEmitter();
        this.no = new EventEmitter();
        this.answer = new EventEmitter();
    }

    yesClick() {
        this.yes.next('y');
        this.answer.next('y');
    }

    noClick() {
        this.no.next('n');
        this.answer.next('n');
    }
}
