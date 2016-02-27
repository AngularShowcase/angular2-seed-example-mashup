import {Component, Input} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'todo-tag',
    template: `
    <div style="color:red">{{tag}}</div>
    `,
    directives: [CORE_DIRECTIVES]
})

export class TodoTag {

    @Input()
    tag: string;

    ngOnInit() {
        console.log('Initializing a todo tag');
    }
}
