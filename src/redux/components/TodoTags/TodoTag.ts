import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'todo-tag',
    template: `
    <div (click)="tagClick()" style="display:inline-block; cursor:pointer; border-radius:5px;
        color:gold; background-color:black; padding:5px">{{tag}} - {{isSelected}}</div>
    `,
    directives: [CORE_DIRECTIVES]
})

export class TodoTag {

    @Input() tag: string;
    @Input() isSelected: boolean;
    @Output() tagClicked: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit() {
        console.log('Initializing a todo tag');
    }

    tagClick() {
        this.tagClicked.next(this.tag);
    }
}
