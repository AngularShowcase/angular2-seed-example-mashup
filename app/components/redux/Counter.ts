import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {CounterService} from '../../services/redux/CounterService';

@Component({
    selector: 'redux-counter',
    templateUrl: './components/redux/Counter.html',
    styleUrls: ['./components/redux/Counter.css'],
    directives: [CORE_DIRECTIVES]
})

// Name this class RoleComponent to avoid a name collision with models Role object
export class Counter {

    constructor(public counterService:CounterService) {
        console.log('Constructed the redux Counter component.');
        console.log('Initial data state is: ', this.counterService.getState());

        this.counterService.incrementCounter();
        this.counterService.incrementCounter();
    }

    ngOnInit() {
        console.log('in ngOnInit');
        this.counterService.decrementCounter();
        console.log('COUNTER state is:', this.counterService.getState());
    }
}
