import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {DataService} from '../../services/DataService';

class ActionNames {
    static IncrementCounter = 'INCREMENT_COUNTER';
    static DecrementCounter = 'DECREMENT_COUNTER';
};

@Component({
    selector: 'redux-counter',
    templateUrl: './components/redux/Counter.html',
    styleUrls: ['./components/redux/Counter.css'],
    directives: [CORE_DIRECTIVES]
})

// Name this class RoleComponent to avoid a name collision with models Role object
export class Counter {

    constructor(public dataService:DataService) {
        console.log('Constructed the redux Counter component.');
        console.log('Initial data state is: ', this.dataService.getState());

        this.incrementCounter();
        this.incrementCounter();
    }

    static counterReducer(counter:number, action) {

        if (counter === undefined) {
            return 0;   // Return initial state
        }

        switch(action.type) {

            case ActionNames.IncrementCounter:
                return counter + 1;

            case ActionNames.DecrementCounter:
                return counter - 1;

            default:
                return counter;
        }
    }

    ngOnInit() {
        console.log('in ngOnInit');
        this.decrementCounter();
        console.log('New data state is: ', this.dataService.getState());
    }

    incrementCounter() {
        this.dataService.dispatch({
            type: ActionNames.IncrementCounter
        });
    }

    decrementCounter() {
        this.dataService.dispatch({
            type: ActionNames.DecrementCounter
        });
    }
}
