import {Component, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoService, ITodoState, ITodo} from '../../services/redux/TodoService';

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
            .map(state => state.todos);
    }

    ngOnInit() {
        this.todoService.addTodo('This the first todo');
        this.todoService.addTodo('This the second todo');
    }

    addTodo($event) {
        let description = $event.value;
        console.log('Adding a new todo: ', description);
        this.todoService.addTodo(description);
    }

    getTodoClass(todo:ITodo) {
        return todo.done ? "completed" : "active";
    }

    toggleTodo(todo:ITodo) {
        this.todoService.toggleTodo(todo.id);
    }
}
