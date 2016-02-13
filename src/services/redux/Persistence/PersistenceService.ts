import {Injectable, EventEmitter} from 'angular2/core';
import {DataService} from '../DataService';
import {IActionSavedState, ActionNames, IPersistenceState} from './PersistenceReducer';

@Injectable()
export class PersistenceService {

    public persistenceStateChanged: EventEmitter<IPersistenceState>;

    constructor(public dataService:DataService) {

        this.persistenceStateChanged = new EventEmitter<IPersistenceState>();

        this.dataService.store.subscribe(() => {
            this.pushStateToSubscribers();
        });
    }

    // This method can be called by subscribers to force a push.  Useful when a
    // component is initialized.
    pushStateToSubscribers() {
        let persistenceState = this.getState();
        console.log('PersistenceService publishing state change:', persistenceState);
        this.persistenceStateChanged.next(persistenceState);
    }

    getState() : IPersistenceState {
        return this.dataService.getState().persistence;
    }

    savedState(saveTime:Date) {
        let action:IActionSavedState = {
            type: ActionNames.SavedState,
            saveTime
        };

        this.dataService.dispatch(action);
    }
}
