import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITodoState, ITodo, FilterNames} from '../../services/redux/Todo/TodoReducer';
import {TodoService} from '../../services/redux/Todo/TodoService';

@Component({
    selector: 'todo',
    templateUrl: './components/redux/todo.html',
    styleUrls: ['./components/redux/todo.css'],
    directives: [CORE_DIRECTIVES],
    // See http://victorsavkin.com/post/133936129316/angular-immutability-and-encapsulation
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Todo {

    todoState: Observable<ITodoState>;
    filteredTodos: Observable<ITodo[]>;
    name = 'howard';

    constructor(public todoService:TodoService) {
    }

    ngOnInit() {

        setTimeout(()=> this.name = 'David', 3000);

        this.todoState = this.todoService.todoStateChanged;

        this.filteredTodos = this.todoState
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
