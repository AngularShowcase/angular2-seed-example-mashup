import {Component, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoService, ITodoState, ITodo, FilterNames} from '../../services/redux/TodoService';

@Component({
    selector: 'todo',
    templateUrl: './components/redux/todo.html',
    styleUrls: ['./components/redux/todo.css'],
    directives: [CORE_DIRECTIVES]
})

export class Todo {

    filteredTodos: Observable<ITodo[]>;
    filterName: Observable<string>;

    constructor(public todoService:TodoService) {
        this.filterName = new EventEmitter<string>();
    }

    ngOnInit() {
        this.filterName = this.todoService.todoStateChanged
            .map(state => state.filterName);

        this.filteredTodos = this.todoService.todoStateChanged
            .map(state => state.todos.filter(todo => {
                return  state.filterName === FilterNames.All  ||
                        state.filterName === FilterNames.Active && !todo.done ||
                        state.filterName === FilterNames.Complete && todo.done;
            }));
    }

    addTodo(inputCtrl:HTMLInputElement) {
        let description = inputCtrl.value;
        this.todoService.addTodo(description);
        inputCtrl.value = '';   // Does this work
        inputCtrl.focus();

        // If we are adding, make sure the user can see the result
        if (this.todoService.getState().filterName === FilterNames.Complete) {
            this.todoService.filterTodos(FilterNames.Active);
        }
    }

    deleteTodo(todo:ITodo) {
        this.todoService.deleteTodo(todo.id);
    }

    getTodoClass(todo:ITodo) {
        return todo.done ? 'completed' : 'active';
    }

    toggleTodo(todo:ITodo) {
        this.todoService.toggleTodo(todo.id);
    }

    filter(filterName:string) {
        this.todoService.filterTodos(filterName);
    }

    getFilterClass(buttonFilterName:string) : string {
        let currentFilterName = this.todoService.getState().filterName;
        return buttonFilterName === currentFilterName ? 'active' : 'inactive';
    }
}
