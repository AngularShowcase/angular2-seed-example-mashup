import {Injectable, EventEmitter} from 'angular2/core';
import {DataService} from '../DataService';
import {ITodoState, ActionNames} from './TodoReducer';

@Injectable()
export class TodoService {

    public todoStateChanged: EventEmitter<ITodoState>;

    constructor(public dataService:DataService) {
        this.todoStateChanged = new EventEmitter<ITodoState>();
        this.dataService.store.subscribe(() => {
            let todoState = this.dataService.getState().todos;
            console.log(`TodoService publishing state change ${todoState}.`);
            this.todoStateChanged.next(todoState);
        });
    }

    // Consumer methods to encapsulate DataService interaction

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

    filterTodos(filterName:string) {
        this.dataService.dispatch({
            type: ActionNames.FilterTodos,
            filterName
        });
    }
}
