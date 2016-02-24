import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITodoState, ITodo, FilterNames} from '../../services/redux/Todo/TodoReducer';
import {TodoService} from '../../services/redux/Todo/TodoService';
import {autocomplete} from 'jquery-ui/autocomplete';
import * as jQuery from 'jquery';

declare let $:any;

@Component({
    selector: 'todo',
    templateUrl: './redux/components/Todo.html',
    styleUrls: ['./redux/components/Todo.css'],

    // If we only rely on immutable inputs and properties, we can get performance
    // gains by telling angular to only check for changes when our inputs change.
    // See http://victorsavkin.com/post/133936129316/angular-immutability-and-encapsulation

    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [CORE_DIRECTIVES]
})

export class Todo {

    todoState: Observable<ITodoState>;
    filteredTodos: Observable<ITodo[]>;
    textCompletionFunc:(request:{term: string}, callback:string)=>void;

    constructor(public todoService:TodoService) {
        this.todoState = this.todoService.todoStateChanged;
        this.filteredTodos = this.todoState
            .map(state => state.todos.filter(todo => {
                return  state.filterName === FilterNames.All  ||
                        state.filterName === FilterNames.Active && !todo.done ||
                        state.filterName === FilterNames.Complete && todo.done;
            }));

        this.textCompletionFunc = this.getTags.bind(this);
        console.log('autocomplete func is', autocomplete);
    }

    ngAfterContentInit() {
        console.log('ngAfterContentInit');
    }

    hookInputs() {
        jQuery('input').autocomplete({
            source: this.textCompletionFunc
        });
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

    keydown(todo:ITodo,tag:HTMLInputElement, event:KeyboardEvent) {
        event.shiftKey = true;
        if (event.keyCode === 13) {
            console.log(`Adding tag ${tag.value} to todo ${todo.description}.`);
            this.todoService.addTag(todo.id, tag.value);
            tag.value = '';

            var tags = this.todoService.getTags();
            console.log('tags: ', tags);
        }
    }

    deleteTag(todo:ITodo, tag:string) {
        this.todoService.deleteTag(todo.id, tag);
    }

    todoInputLoad(input:HTMLInputElement) {
        // let id = input.id;
        // console.log(`Input ${id} loaded.`);
        // jQuery(<any>input).autocomplete({
        //     source: this.textCompletionFunc
        // });

        this.hookInputs();
    }

    getTags(request:{term: string}, callback:(string)=>void)  {
        let tags = this.todoService.getTags();
        let instr = request.term.toLowerCase();
        let matches = tags.filter(t => t.toLowerCase().indexOf(instr) >= 0);
        callback(matches);
    }
}
