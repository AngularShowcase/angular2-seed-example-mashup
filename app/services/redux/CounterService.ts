import {Injectable} from 'angular2/core';
import {DataService} from './DataService';

class ActionNames {
    static IncrementCounter = 'INCREMENT_COUNTER';
    static DecrementCounter = 'DECREMENT_COUNTER';
    static IncrementCounterNumber = 'INCREMENT_COUNTER_NUMBER';
    static DecrementCounterNumber = 'DECREMENT_COUNTER_NUMBER';
};

class CounterState {

    constructor(public counters:number[] = [0], public counterNumber:number = 0) {
    }

    getCounterVal() {
        return this.counters[this.counterNumber];
    }
}

@Injectable()
export class CounterService {

    constructor(public dataService:DataService) {
    }

    // Reducer is static so that the data service can reference it without an object
    static counterReducer(counterState:CounterState, action) : CounterState {

        if (counterState === undefined) {
            return new CounterState();   // Undefined state.  Return initial state
        }

        let index: number;
        let counters: number[];
        let newVal: number;

        switch(action.type) {

            case ActionNames.IncrementCounter:
                index = counterState.counterNumber;
                newVal = counterState.counters[index] + 1;
                counters = [...counterState.counters.slice(0, index), newVal, ...counterState.counters.slice(index + 1)];
                return new CounterState(counters, index);

            case ActionNames.DecrementCounter:
                index = counterState.counterNumber;
                newVal = counterState.counters[index] - 1;
                counters = [...counterState.counters.slice(0, index), newVal, ...counterState.counters.slice(index + 1)];
                return new CounterState(counters, index);

            case ActionNames.IncrementCounterNumber:
                return CounterService.IncrementCounterNumberInternal(counterState);

            case ActionNames.DecrementCounterNumber:
                return CounterService.DecrementCounterNumberInternal(counterState);

            default:                        // Unknown action.  Don't change state
                return counterState;
        }
    }

    // private static methods used by the reducer function

    private static IncrementCounterNumberInternal(state:CounterState) : CounterState {
        let newCounter:number = state.counterNumber + 1;
        let counters:number[] = newCounter >= state.counters.length ?
            [...state.counters, 0] : state.counters;

        return new CounterState(counters, newCounter);
    }

    private static DecrementCounterNumberInternal(state:CounterState) : CounterState {
        let newCounter:number = state.counterNumber - 1;
        return new CounterState(state.counters, newCounter < 0 ? 0 : newCounter);
    }

    // Consumer methods to encapsulate DataService interaction

    getState() : any {
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
