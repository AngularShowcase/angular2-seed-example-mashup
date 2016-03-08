import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {TodoTag} from './TodoTag';
import {ITagSummary} from '../../../services/redux/Todo/TodoReducer';

@Component({
    selector: 'todo-tags',
    templateUrl: './redux/components/TodoTags/TodoTags.html',
    styleUrls: ['./redux/components/TodoTags/TodoTags.css'],
    directives: [CORE_DIRECTIVES, TodoTag]
})

export class TodoTags {

    @Input() tags: Observable<ITagSummary[]>;
    @Input() selectedTag: string;
    @Output() tagSelected: EventEmitter<string> = new EventEmitter<string>();

    tagClicked(tag:ITagSummary) {
        this.tagSelected.next(tag.tag);
    }
}
