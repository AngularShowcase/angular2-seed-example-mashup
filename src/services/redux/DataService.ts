import {Injectable} from 'angular2/core';
import {CounterReducer, ICounterState} from './Counter/CounterReducer';
import {TodoReducer, ITodoState} from './Todo/TodoReducer';
import {PersistenceReducer, IPersistenceState} from './Persistence/PersistenceReducer';
import * as Redux from 'redux';

interface IDataState {
    persistence: IPersistenceState;
    todos: ITodoState;
    counter: ICounterState;
}

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

        let savedState = this.getSavedState();
        console.log('Initializing store with state:', savedState);

        // Create the store and hook up the Chrome dev tools if it exists.
        // See https://github.com/zalmoxisus/redux-devtools-extension#implementation
        this.store = Redux.createStore(reducer, savedState, window['devToolsExtension'] ? window['devToolsExtension']() : f => f);
        this.store.subscribe(this.storeListener.bind(this));
	}

    mySampleMiddleWare(state:any) : any {
        return state;
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

    private getSavedState() : IDataState {
        let serialized = localStorage.getItem('state');
        if (!serialized) {
            return <IDataState> {};
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
    // Note that we can mutate here because this is the object read in at from localstorage
    // at startup.  NOT A PURE FUNCTION
    private fixDates(state: IDataState) {

        state.persistence.saveTime = new Date(<string> state.persistence.saveTime);
        state.todos.todos.forEach(todo => {
            if (todo.completed) {
                todo.completed = new Date(<string>todo.completed);
            }
            if (todo.created) {
                todo.created = new Date(<string>todo.created);
            } else {
                todo.created = new Date();
            }
        });

        return state;
    }
}
