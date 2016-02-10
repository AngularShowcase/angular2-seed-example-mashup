import {Injectable} from 'angular2/core';
import {DataService} from '../DataService';
import {ActionNames, ICounterState} from './CounterReducer';

@Injectable()
export class CounterService {

    constructor(public dataService:DataService) {
    }

    // Consumer methods to encapsulate DataService interaction

    getState() : ICounterState {
        let fullState = this.dataService.getState();
        let counterState = fullState.counter;
        return counterState;
    }

    // additional public methods for the consumer of the service
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

    incrementCounterNumber() {
        this.dataService.dispatch({
            type: ActionNames.IncrementCounterNumber
        });
    }

    decrementCounterNumber() {
        this.dataService.dispatch({
            type: ActionNames.DecrementCounterNumber
        });
    }
}
