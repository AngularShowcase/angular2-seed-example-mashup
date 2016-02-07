import {Injectable} from 'angular2/core';
import {DataService} from './DataService';
import {Todo} from '../../models/Todo';

class ActionNames {
    static AddTodo = 'ADD_TODO';
    static ToggleTodo = 'TOGGLE_TODO';
};

interface ITodoState {

    todos:Todo[];
    filter: string;
}

@Injectable()
export class TodoService {

    constructor(public dataService:DataService) {
    }

    // Reducer is static so that the data service can reference it without an object
    static todoReducer(state:ITodoState, action) : ITodoState {

        if (state === undefined) {      // Undefined state.  Return initial state
            return {
                todos: [],
                filter: ''
            }
        }

        switch(action.type) {

            case ActionNames.AddTodo:
                let description:string = action.description;
                return Object.assign({}, state, {todos:[...state.todos, new Todo(description)]});

            case ActionNames.ToggleTodo:
                return TodoService.toggleTodo(state, action);

            default:                        // Unknown action.  Don't change state
                return state;
        }
    }

    // private static methods used by the reducer function

    static toggleTodo(state:ITodoState, action:{type:string, id: number}) : ITodoState {
        return Object.assign({}, state,
            { todos: state.todos.map(todo => {
                if (todo.id !== action.id) {
                    return todo;
                }
                else {
                    let newTodo = new Todo(todo.description)
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
}
