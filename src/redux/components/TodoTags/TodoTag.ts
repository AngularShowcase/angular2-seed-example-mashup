import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITagSummary} from '../../../services/redux/Todo/TodoReducer';

@Component({
    selector: 'todo-tag',
    template: `
    <div
        (click)="tagClick()"
        style="display:inline-block; cursor:pointer; border-radius:5px; padding:5px"
        [ngClass]="isSelected ? 'active' : 'inactive'">
        {{tag.tag}} - {{tag.completed}}/{{tag.total}}
    </div>
    `,
    styles: [
        `
        .inactive {
            background-color: black;
            color: gold;

        }
        .active {
            background-color: yellow;
            border: 1px solid black;
            color: red;
        }
        `
    ],
    directives: [CORE_DIRECTIVES]
})

export class TodoTag {

    @Input() tag: ITagSummary;
    @Input() isSelected: boolean;
    @Output() tagClicked: EventEmitter<ITagSummary> = new EventEmitter<ITagSummary>();

    ngOnInit() {
        console.log('Initializing a todo tag');
    }

    tagClick() {
        this.tagClicked.next(this.tag);
    }
}
