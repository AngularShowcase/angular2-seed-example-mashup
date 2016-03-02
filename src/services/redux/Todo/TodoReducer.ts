import * as _ from 'underscore';

type TodosByTag = Map<string, ITodo[]>;

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

export interface ITagSummary {
    tag: string;
    completed: number;
    active: number;
    total: number;
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
    tagSummary: ITagSummary[];
}

export class TodoReducer {

    static reducer(state:ITodoState, action) : ITodoState {
        let s1 = TodoReducer.action_reducer(state, action);
        let s2 = TodoReducer.tag_summary_reducer(s1);

        return s2;
    }

    private static tag_summary_reducer(state:ITodoState) : ITodoState {

        let todosByTag:TodosByTag = TodoReducer.groupTodosByTag(state.todos);
        let tagSummaries:ITagSummary[] = TodoReducer.createTagSummariesFromTodosGroupedByTag(todosByTag);

        return Object.assign({}, state, { tagSummary: tagSummaries });
    }

    private static createTagSummariesFromTodosGroupedByTag(todosByTag:TodosByTag) : ITagSummary[] {

        let tagSummaries:ITagSummary[] = _.map(Array.from(todosByTag.keys()), (tag:string) => {
            let todos = todosByTag.get(tag);
            let summary:ITagSummary = {
                tag: tag,
                active: 0,
                completed: 0,
                total: 0
            };

            let summaryForTag = _.reduce(todos, (acc:ITagSummary, todo:ITodo) => {
                acc.total += 1;
                if (todo.completed) {
                    acc.completed += 1;
                } else {
                    acc.active += 1;
                }

                return acc;
            }, summary);

            return summaryForTag;
        });

        return tagSummaries;
    }

    private static groupTodosByTag(todos:ITodo[]) : TodosByTag {
        let tagDict:TodosByTag = new Map<string, ITodo[]>();

        tagDict = _.reduce(todos, (dict:TodosByTag, todo:ITodo) => {
                    todo.tags.forEach(tag => {
                        if (dict.has(tag)) {
                            dict.get(tag).push(todo);
                        } else {
                            dict.set(tag, [todo]);
                        }
                    });

                    return dict;
                }
                , tagDict);

        return tagDict;
    }

    // Reducer is static so that the data service can reference it without an object
    private static action_reducer(state:ITodoState, action) : ITodoState {

        if (state === undefined) {      // Undefined state.  Return initial state
            return {
                todos: [],
                filterName: FilterNames.All,
                nextId: 1,
                tagFilter: null,
                tagSummary: []
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
