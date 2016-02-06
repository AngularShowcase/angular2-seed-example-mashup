import {Injectable} from 'angular2/core';
import {Counter} from '../components/redux/counter';

@Injectable()
export class DataService {

    store:Redux.Store;

	constructor() {
        console.log('Constructing the data service.');

        let reducer = Redux.combineReducers({
            counter: Counter.counterReducer
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


    storeListener() {
        console.log('storeListener: State: ', this.store.getState());
    }
}
