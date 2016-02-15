import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {CounterService} from '../../services/redux/Counter/CounterService';

@Component({
    selector: 'redux-counter',
    templateUrl: './redux/components/Counter.html',
    styleUrls: ['./redux/components/Counter.css'],
    directives: [CORE_DIRECTIVES]
})

export class Counter {
    constructor(public counterService:CounterService) {
    }

    getCounterVal() {
        let state = this.counterService.getState();
        return state.counters[state.counterNumber];
    }
}
