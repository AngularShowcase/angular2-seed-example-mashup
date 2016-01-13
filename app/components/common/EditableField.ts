import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

enum InputMode {
    PICKLIST,
    FREEFORM
}

@Component({
    selector: 'editable-field',
    templateUrl: './components/common/EditableField.html',
    styleUrls: ['./components/common/EditableField.css'],
    inputs: ['val', 'selectFrom:select-from'],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class EditableField {

    val:string = '';
    selectFrom:string[] = [];
    usePickList:boolean = false;
    origVal:string = '';
    editing:boolean = false;
    mode: InputMode = InputMode.PICKLIST;

    get hidePickList() {
        return !this.editing || !this.usePickList || this.mode === InputMode.FREEFORM;
    }

    get hideFreeForm() {
        return !this.editing || (this.usePickList && this.mode === InputMode.PICKLIST);
    }

    get hidePlusButton() {
        return this.hidePickList;
    }

    ngOnInit() {
        this.origVal = this.val;
        this.usePickList = this.selectFrom.length > 0;
        if (!this.usePickList) {
            this.mode = InputMode.FREEFORM;
        }
    }

    changed() {
        return this.val !== this.origVal;
    }

    getChangedClass() {
        return this.changed() ? 'changed' : '';
    }

    valueChange(newVal:string) {
        console.log(newVal);
    }

    pickListItemSelected() {
        this.editing = false;
        console.log('selected', this.val);
    }

    plusButtonClicked() {
        this.mode = InputMode.FREEFORM;
    }

    getSpanTooltip() {
        return this.changed() ? `Original value was '${this.origVal}'.` : 'Value unchanged';
    }
}
