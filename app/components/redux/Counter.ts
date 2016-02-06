import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ActionNames, DataService} from '../../services/DataService';

@Component({
    selector: 'redux-counter',
    templateUrl: './components/redux/Counter.html',
    styleUrls: ['./components/redux/Counter.css'],
    directives: [CORE_DIRECTIVES]
})

// Name this class RoleComponent to avoid a name collision with models Role object
export class Counter {

    constructor(public dataService:DataService) {
        console.log('Constructed the redux Counter component.');

        this.initializeCounter(4);

        console.log('Initial data state is: ', this.dataService.getState());

        this.incrementCounter();
    }

    ngOnInit() {
        console.log('in ngOnInit');
        this.incrementCounter();
        console.log('New data state is: ', this.dataService.getState());
    }
    
    incrementCounter() {
        this.dataService.dispatch({
            type: ActionNames.IncrementCounter
        });
    }

    initializeCounter(initialValue:number) {
        this.dataService.dispatch({
            type: ActionNames.InitializeCounter,
            initialValue: initialValue
        });
    }
}
