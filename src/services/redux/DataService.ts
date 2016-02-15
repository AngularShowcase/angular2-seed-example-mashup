import {Injectable} from 'angular2/core';
import {CounterReducer} from './Counter/CounterReducer';
import {TodoReducer} from './Todo/TodoReducer';
import {PersistenceReducer} from './Persistence/PersistenceReducer';
import * as Redux from 'redux';

@Injectable()
export class DataService {

    store:Redux.Store;

	constructor() {
        console.log('Constructing the data service.');

        let reducers = {
            persistence: PersistenceReducer.reducer,
            todos: TodoReducer.reducer,
            counter: CounterReducer.reducer
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

    subscribe(listener) : any {
        return this.store.subscribe(listener);
    }

    // Called periodically by the app to persist the state to local storage
    saveState() {
        let serialized:string = JSON.stringify(this.store.getState());
        localStorage.setItem('state', serialized);
    }

    private getSavedStae() {
        let serialized = localStorage.getItem('state');
        if (!serialized) {
            return {};
        }

        let state = JSON.parse(serialized);

        let fixedState = this.fixDates(state);
        return fixedState;
    }

    private storeListener() {
        console.log('storeListener: State: ', this.store.getState());
    }

    // This is a real hack.  JSON doesn't serializes dates as strings but
    // deserializes back to string, not date.  There are better ways to do this.
    // As an example, see http://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates

    private fixDates(state) {
        return {
            persistence: {
                saveTime: new Date(state.persistence.saveTime)
            },
            todos: state.todos,
            counter: state.counter
        };
    }
}
