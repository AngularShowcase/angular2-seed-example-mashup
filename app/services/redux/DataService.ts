import {Injectable} from 'angular2/core';
import {CounterReducer} from './Counter/CounterReducer';
import {TodoReducer} from './Todo/TodoReducer';

@Injectable()
export class DataService {

    store:Redux.Store;

	constructor() {
        console.log('Constructing the data service.');

        let reducers = {
            counter: CounterReducer.reducer,
            todos: TodoReducer.reducer
        };

        let reducer = Redux.combineReducers(reducers);
        console.log('Created a combined reducer with the following keys');

        for (var key in reducers) {
            console.log(`Reducer key ${key}.`);
        }

        let savedState = this.getSavedStae();
        console.log('Initializing store with state:', savedState);
        this.store = Redux.createStore(reducer, savedState);

        this.store.subscribe(this.storeListener.bind(this));
	}

    dispatch(action:any) {
        console.log('Dispatching action:', action.type, action);
        this.store.dispatch(action);
    }

    getState() : any {
        return this.store.getState();
    }

    storeListener() {
        console.log('storeListener: State: ', this.store.getState());
    }

    subscribe(listener) : any {
        return this.store.subscribe(listener);
    }

    saveState() {
        let serialized:string = JSON.stringify(this.store.getState());
        localStorage.setItem('state', serialized);
    }

    getSavedStae() {
        let serialized = localStorage.getItem('state');
        if (!serialized) {
            return {};
        }

        let state = JSON.parse(serialized);
        return state;
    }
}
