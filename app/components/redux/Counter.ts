import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {CounterService} from '../../services/redux/CounterService';

@Component({
    selector: 'redux-counter',
    templateUrl: './components/redux/Counter.html',
    styleUrls: ['./components/redux/Counter.css'],
    directives: [CORE_DIRECTIVES]
})

export class Counter {
    constructor(public counterService:CounterService) {
    }
}
