import {Component, EventEmitter} from 'angular2/angular2';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';

@Component({
    selector: 'yes-no',
    outputs: ['yes','no','answer'],
    templateUrl: './components/common/YesNo.html',
    directives: [FORM_DIRECTIVES, NgClass],
    styleUrls: ['./components/common/YesNo.css']
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
