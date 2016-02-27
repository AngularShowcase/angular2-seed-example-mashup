import {Component, Input} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {TodoTag} from './TodoTag';

@Component({
    selector: 'todo-tags',
    templateUrl: './redux/components/TodoTags/TodoTags.html',
    styleUrls: ['./redux/components/TodoTags/TodoTags.css'],
    directives: [CORE_DIRECTIVES, TodoTag]
})

export class TodoTags {

    @Input()
    tags: Observable<string[]>;



}
