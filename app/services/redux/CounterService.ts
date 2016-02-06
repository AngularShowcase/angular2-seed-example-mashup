import {Injectable} from 'angular2/core';
import {DataService} from './DataService';

class ActionNames {
    static IncrementCounter = 'INCREMENT_COUNTER';
    static DecrementCounter = 'DECREMENT_COUNTER';
};

@Injectable()
export class CounterService {

    constructor(public dataService:DataService) {
    }

    // Reducer is static so that the data service can reference it without an object
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

    // Consumer methods to encapsulate DataService interaction

    getState() : any {
        let fullState = this.dataService.getState();
        let counterState = fullState.counter;

        return counterState;
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
