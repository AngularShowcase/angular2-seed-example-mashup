export class ActionNames {
    static IncrementCounter = 'INCREMENT_COUNTER';
    static DecrementCounter = 'DECREMENT_COUNTER';
    static IncrementCounterNumber = 'INCREMENT_COUNTER_NUMBER';
    static DecrementCounterNumber = 'DECREMENT_COUNTER_NUMBER';
};

export interface ICounterState {
    counters:number[];
    counterNumber:number;
}

export class CounterReducer {

    // Reducer is static so that the data service can reference it without an object
    static reducer(state:ICounterState, action) : ICounterState {

        if (state === undefined) {
            return {
                counters: [0],
                counterNumber: 0
            };  // Undefined state.  Return initial state
        }

        let index: number;
        let counters: number[];
        let newVal: number;

        switch(action.type) {

            case ActionNames.IncrementCounter:
                index = state.counterNumber;
                newVal = state.counters[index] + 1;
                counters = [...state.counters.slice(0, index), newVal, ...state.counters.slice(index + 1)];
                return Object.assign({}, state, {counters});

            case ActionNames.DecrementCounter:
                index = state.counterNumber;
                newVal = state.counters[index] - 1;
                counters = [...state.counters.slice(0, index), newVal, ...state.counters.slice(index + 1)];
                return Object.assign({}, state, {counters});

            case ActionNames.IncrementCounterNumber:
                return CounterReducer.IncrementCounterNumberInternal(state);

            case ActionNames.DecrementCounterNumber:
                return CounterReducer.DecrementCounterNumberInternal(state);

            default:                        // Unknown action.  Don't change state
                return state;
        }
    }

    // private static methods used by the reducer function

    private static IncrementCounterNumberInternal(state:ICounterState) : ICounterState {
        let newCounter:number = state.counterNumber + 1;
        let counters:number[] = newCounter >= state.counters.length ?
            [...state.counters, 0] : state.counters;

        return Object.assign({}, state, {counters, counterNumber: newCounter});
    }

    private static DecrementCounterNumberInternal(state:ICounterState) : ICounterState {
        let newCounter:number = state.counterNumber === 0 ? 0 : state.counterNumber - 1;
        return Object.assign({}, state, {counterNumber: newCounter});
    }

}
