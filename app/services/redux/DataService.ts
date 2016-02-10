import {Injectable} from 'angular2/core';
//import {CounterService} from './CounterService';
import {TodoReducer} from './Todo/TodoReducer';

@Injectable()
export class DataService {

    store:Redux.Store;

	constructor() {
        console.log('Constructing the data service.');

        let reducer = Redux.combineReducers({
            //counter: CounterService.counterReducer,
            todos: TodoReducer.reducer
        });

        this.store = Redux.createStore(reducer, {});

        console.log('store constructed:', this.store);
        this.store.subscribe(this.storeListener.bind(this));
	}

    dispatch(action:any) {
        console.log('Dispatching action:', action.type);
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
}
