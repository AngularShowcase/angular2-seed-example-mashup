import {Injectable} from 'angular2/core';
import {DataService} from '../DataService';
import {ITodoState, ActionNames} from './TodoReducer';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';

@Injectable()
export class TodoService {

    public todoStateChanged: Subject<ITodoState>;

    constructor(public dataService:DataService) {

        // We use a BehaviorSubject so that subscribers get the latest value right
        // away.

        this.todoStateChanged = new BehaviorSubject<ITodoState>(this.getState());

        // Subscribe to store changes and publish just our state
        this.dataService.store.subscribe(() => {
            let todoState = this.getState();
            console.log('TodoService publishing state change:', todoState);
            this.todoStateChanged.next(todoState);
        });
    }

    getState() : ITodoState {
        return this.dataService.getState().todos;
    }

    // additional public methods for the consumer of the service

    addTodo(description:string) {
        this.dataService.dispatch({
            type: ActionNames.AddTodo,
            description
        });
    }

    deleteTodo(id:number) {
        this.dataService.dispatch({
            type: ActionNames.DeleteTodo,
            id
        });
    }

    toggleTodo(id:number) {
        this.dataService.dispatch({
            type: ActionNames.ToggleTodo,
            id
        });
    }

    addTag(id:number, tag:string) {
        this.dataService.dispatch({
            type: ActionNames.AddTag,
            id,
            tag
        });
    }

    deleteTag(id:number, tag:string) {
        this.dataService.dispatch({
            type: ActionNames.DeleteTag,
            id,
            tag
        });
    }

    filterTodos(filterName:string) {
        this.dataService.dispatch({
            type: ActionNames.FilterTodos,
            filterName
        });
    }
}
