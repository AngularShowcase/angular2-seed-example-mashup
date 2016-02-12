import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Parser} from '../../services/Parser';

@Component({
    selector: 'object-display',
    providers: [Parser],
    inputs: ['displayObject:display-object', 'niceLabels:nice-labels', 'collapsed'],
    outputs: ['selectobject:selectobject'],
    templateUrl: './components/objectDisplay/ObjectDisplay.html',
    styleUrls: ['./components/objectDisplay/ObjectDisplay.css'],
    directives: [CORE_DIRECTIVES, ObjectDisplay]
})
export class ObjectDisplay {

    _displayObject: any;
    _collapsed: boolean;
    niceLabels: boolean;
    selectobject: EventEmitter<any>;
    parser: Parser;
    objectProperties: string[] = [];

    constructor(parser: Parser) {
        //console.log('In ObjectDisplay constructor');
        this.parser = parser;
        this.niceLabels = true;
        this.collapsed = false;
        //this.displayObject = {};
        this.selectobject = new EventEmitter<any>();
    }

    get collapsed() : boolean {
        return this._collapsed;
    }

    set collapsed(val:boolean) {
        // console.log(`Collapsed being set to ${val}`);
        this._collapsed = val;
        this.objectProperties = this.getObjectProperties();
    }

    get displayObject() {
        return this._displayObject;
    }

    set displayObject(val) {
        // console.log('Setting display object to: ', val);
        this._displayObject = val;
        this.objectProperties = this.getObjectProperties();
    }

    getType(): string {
        if (Array.isArray(this._displayObject)) {
            return 'array';
        }

        if (this._displayObject && this._displayObject.constructor &&
            this._displayObject.constructor === Date) {
                // console.log('Displaying a date: ', this._displayObject);
                return 'date';
            }

        return typeof (this._displayObject);
    }

    // I don't think this is used
    getTheType(val: any) {
        return typeof (val);
    }

    isObject(): boolean {
        return this.getType() === 'object';
    }

    isArray(): boolean {
        return this.getType() === 'array';
    }

    // If we are getting only the 'first' property, the object being displayed is collapsed.  We
    // want to show at least one property and an expander.  We favor any property with the word
    // name at the beginning.  If none is found, just return the first property.

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    objectClick(ev) {
        //console.log('click on', ev, this.displayObject);
        this.selectobject.next(this);
    }

    objectSelected($event) {
        //console.log('Propagating', $event);
        this.selectobject.next($event);
    }

    propNameToLabel(propName: string): string {

        if (!this.niceLabels) {
            return propName;
        }

        return this.parser.propertyNameToLabel(propName);
    }

    private getObjectProperties(): string[] {

        let firstOnly: boolean = this.collapsed;

        var props: string[] = [];

        if (!this.isObject()) {
            return props;
        }

        for (var prop in this.displayObject) {
            if (firstOnly && /.*name.*/.test(prop.toLowerCase())) {
                return [prop];
            }
            props.push(prop);
        }

        var result = (firstOnly) ? props.slice(0, 1) : props;
        // console.log(`getObjectProperties: ${result}`);
        return result;
    }
}
