import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoService} from '../../services/redux/TodoService';

@Component({
    selector: 'todo',
    templateUrl: './components/redux/todo.html',
    styleUrls: ['./components/redux/todo.css'],
    directives: [CORE_DIRECTIVES]
})

export class Todo {
    constructor(public todoService:TodoService) {
    }
}
