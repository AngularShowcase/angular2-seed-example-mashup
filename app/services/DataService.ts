import {Injectable} from 'angular2/core';

export class ActionNames {
    static InitializeCounter = 'INITIALIZE_COUNTER';
    static IncrementCounter = 'INCREMENT_COUNTER';
}

@Injectable()
export class DataService {

    store:Redux.Store;

	constructor() {
        console.log('Constructing the data service.');

        let reducer = Redux.combineReducers({
            counter: this.counterReducer
        });

        this.store = Redux.createStore(reducer, {});

        console.log('store constructed:', this.store);
        this.store.subscribe(this.storeListener.bind(this));
	}

    dispatch(action:any) {
        this.store.dispatch(action);
    }

    getState() : any {
        return this.store.getState();
    }

    counterReducer(counter:number, action) {

        if (counter === undefined) {
            return 0;   // Return initial state
        }
        
        switch(action.type) {

            case 'INITIALIZE_COUNTER':
                return action.initialValue;

            case 'INCREMENT_COUNTER':
                return counter + 1;

            default:
                return counter;
        }
    }

    storeListener() {
        console.log('storeListener: State: ', this.store.getState());
    }
}
