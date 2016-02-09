import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoService, ITodo, FilterNames} from '../../services/redux/TodoService';

@Component({
    selector: 'todo',
    templateUrl: './components/redux/todo.html',
    styleUrls: ['./components/redux/todo.css'],
    directives: [CORE_DIRECTIVES]
})

export class Todo {

    filteredTodos: Observable<ITodo[]>;

    constructor(public todoService:TodoService) {
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
}
