export class ActionNames {
    static SavedState = 'SAVED_STATE';  // Record the save time
};

export interface IPersistenceState {
    saveTime: Date;
}

export interface IActionSavedState {
    type:string;
    saveTime: Date;
}

export class PersistenceReducer {

    // Reducer is static so that the data service can reference it without an object
    static reducer(state:IPersistenceState, action) : IPersistenceState {

        if (state === undefined) {      // Undefined state.  Return initial state
            return {
                saveTime: new Date(0)
            };
        }

        switch(action.type) {

            case ActionNames.SavedState:
                let savedState:IActionSavedState = action;

                return {
                    saveTime: savedState.saveTime
                };

            default:                        // Unknown action.  Don't change state
                return state;
        }
    }
}
