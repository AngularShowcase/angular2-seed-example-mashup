import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

enum InputMode {
    PICKLIST,
    FREEFORM
}

@Component({
    selector: 'editable-field',
    templateUrl: './common/components/EditableField.html',
    styleUrls: ['./common/components/EditableField.css'],
    inputs: ['val', 'selectFrom:select-from', 'fontSize:font-size', 'inputControlType:input-control-type'],
    outputs: ['updates'],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class EditableField {

    updates:EventEmitter<string>;
    val:string = '';
    selectFrom:string[] = [];
    usePickList:boolean = false;
    origVal:string = '';
    editing:boolean = false;
    mode: InputMode = InputMode.PICKLIST;
    fontSize: string = '12pt';
    spanStyle:any;
    inputStyle:any;
    selectStyle:any;
    inputControlType:string = 'text';

    constructor() {
        this.updates = new EventEmitter<string>();
    }

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

        this.spanStyle = {
            'font-size' : this.fontSize
        };

        this.inputStyle = {
            'font-size' : this.fontSize
        };

        // For some reason I don't understand, the font size is not
        // picked up unless I specify border-radius (which appears to be ignored)

        this.selectStyle = {
            'font-size'     : this.fontSize,
            'border-radius' : '6px'
        };
    }

    changed() {
        return this.val !== this.origVal;
    }

    getChangedClass() {
        return this.changed() ? 'changed' : '';
    }

    undo() {
        this.valueChange(this.origVal);
    }

    valueChange(newVal:string) {
        console.log(newVal);
        this.val = newVal;
        this.editing = false;
        this.updates.next(newVal);
    }

    plusButtonClicked() {
        this.mode = InputMode.FREEFORM;
    }

    getSpanTooltip() {
        return this.changed() ? `Original value was '${this.origVal}'.` : 'Value unchanged';
    }
}
