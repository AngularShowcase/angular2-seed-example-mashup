import {Injectable, EventEmitter} from 'angular2/core';
import {DataService} from './DataService';

class ActionNames {
    static AddTodo = 'ADD_TODO';
    static DeleteTodo = 'DELETE_TODO';
    static ToggleTodo = 'TOGGLE_TODO';
    static FilterTodos = 'FILTER_TODOS';
};

export class FilterNames {
    static All = 'ALL';
    static Active = 'ACTIVE';
    static Complete = 'COMPLETE';
}

export interface ITodo {
    id: number;
    description: string;
    done: boolean;
}

export interface ITodoState {

    todos:ITodo[];
    filterName: string;
}

@Injectable()
export class TodoService {

    static nextId:number = 1;
    public todoStateChanged: EventEmitter<ITodoState>;

    constructor(public dataService:DataService) {
        this.todoStateChanged = new EventEmitter<ITodoState>();
        this.dataService.store.subscribe(() => {
            let todoState = this.dataService.getState().todos;
            console.log(`TodoService publishing state change ${todoState}.`);
            this.todoStateChanged.next(todoState);
        });
    }

    // Reducer is static so that the data service can reference it without an object
    static todoReducer(state:ITodoState, action) : ITodoState {

        if (state === undefined) {      // Undefined state.  Return initial state
            return {
                todos: [],
                filterName: FilterNames.All
            };
        }

        switch(action.type) {

            case ActionNames.AddTodo:
                let description:string = action.description;
                return Object.assign({}, state, {todos:[...state.todos,
                    {
                        id: TodoService.nextId++,
                        description,
                        done: false
                    }]});

            case ActionNames.DeleteTodo:

                console.log(`Deleting todo ${action.id}.`);

                return Object.assign({}, state, {
                    todos: state.todos.filter(todo => todo.id !== action.id)
                });

            case ActionNames.ToggleTodo:
                return TodoService.toggleTodo(state, action);

            case ActionNames.FilterTodos:
                return Object.assign({}, state, { filterName: action.filterName });

            default:                        // Unknown action.  Don't change state
                return state;
        }
    }

    // private static methods used by the reducer function

    private static toggleTodo(state:ITodoState, action:{type:string, id: number}) : ITodoState {
        return Object.assign({}, state,
            { todos: state.todos.map(todo => {
                if (todo.id !== action.id) {
                    return todo;
                } else {
                    return Object.assign({}, todo, {done: !todo.done});
                }
            })}
        );
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
