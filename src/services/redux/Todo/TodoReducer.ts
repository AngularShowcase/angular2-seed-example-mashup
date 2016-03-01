export class ActionNames {
    static AddTodo = 'ADD_TODO';
    static DeleteTodo = 'DELETE_TODO';
    static ToggleTodo = 'TOGGLE_TODO';
    static FilterTodos = 'FILTER_TODOS';
    static AddTag = 'ADD_TODO_TAG';
    static DeleteTag = 'DELETE_TODO_TAG';
    static FilterTodosByTag = 'FILTER_TODOS_BY_TAG';
};

export class FilterNames {
    static All = 'ALL';
    static Active = 'ACTIVE';
    static Complete = 'COMPLETE';
}

export interface ITodo {
    id: number;
    description: string;
    created?: Date | string;
    completed?: Date | string;
    tags?: string[];
    done: boolean;
}

export interface ITodoState {
    nextId: number;
    todos:ITodo[];
    filterName: string;
    tagFilter: string;
}

export class TodoReducer {

    // Reducer is static so that the data service can reference it without an object
    static reducer(state:ITodoState, action) : ITodoState {

        if (state === undefined) {      // Undefined state.  Return initial state
            return {
                todos: [],
                filterName: FilterNames.All,
                nextId: 1,
                tagFilter: null
            };
        }

        switch(action.type) {

            case ActionNames.AddTodo:
                let description:string = action.description;
                return Object.assign({}, state, {
                    nextId: state.nextId + 1,
                    todos:[...state.todos,
                    {
                        id: state.nextId,
                        description,
                        created: new Date(),
                        done: false,
                        tags: state.tagFilter ? [state.tagFilter] : []  // If there is a filter, add new todos in that filter
                    }]});

            case ActionNames.DeleteTodo:

                console.log(`Deleting todo ${action.id}.`);

                return Object.assign({}, state, {
                    todos: state.todos.filter(todo => todo.id !== action.id)
                });

            case ActionNames.ToggleTodo:
                return TodoReducer.toggleTodo(state, action);

            case ActionNames.FilterTodos:
                return Object.assign({}, state, { filterName: action.filterName });

            case ActionNames.FilterTodosByTag:
                return Object.assign({}, state, { tagFilter: action.tag });

            case ActionNames.AddTag:
                return TodoReducer.addTag(state, action);

            case ActionNames.DeleteTag:
                return TodoReducer.deleteTag(state, action);

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
                        let updatedTodo = Object.assign({}, todo, {done: !todo.done});
                        if (updatedTodo.done) {
                            updatedTodo.completed = new Date();
                        } else {
                            delete updatedTodo.completed;
                        }

                        return updatedTodo;
                    }
                })
            }
        );
    }

    private static addTag(state:ITodoState, action:{type:string, id: number, tag:string}) : ITodoState {
        return Object.assign({}, state,
            { todos: state.todos.map(todo => {
                    if (todo.id !== action.id || !action.tag) {
                        return todo;
                    } else {
                        return Object.assign({}, todo, {
                            tags:[...(todo.tags ? todo.tags : []), action.tag.toUpperCase()]
                        });
                    }
                })
            }
        );
    }

    private static deleteTag(state:ITodoState, action:{type:string, id: number, tag:string}) : ITodoState {
        return Object.assign({}, state,
            { todos: state.todos.map(todo => {
                    if (todo.id !== action.id || !action.tag) {
                        return todo;
                    } else {
                        return Object.assign({}, todo, {
                            tags: todo.tags.filter(t => t !== action.tag)
                        });
                    }
                })
            }
        );
    }
}
