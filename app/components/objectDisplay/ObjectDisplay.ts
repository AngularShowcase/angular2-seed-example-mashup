import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Parser} from '../../services/Parser';

@Component({
    selector: 'object-display',
    viewBindings: [Parser],
    inputs: ['displayObject:display-object','niceLabels:nice-labels','collapsed'],
    outputs: ['selectobject:selectobject'],
    templateUrl: './components/objectDisplay/ObjectDisplay.html',
    styleUrls: ['./components/objectDisplay/ObjectDisplay.css'],
    directives: [CORE_DIRECTIVES, ObjectDisplay]
})
export class ObjectDisplay {

       _displayObject: any;
       niceLabels: boolean;
       collapsed:boolean;
       selectobject: EventEmitter<any>;
       parser:Parser;

       constructor(parser:Parser) {

           this.parser = parser;
           this.niceLabels = true;
           this.collapsed = false;
           this.displayObject = {};
           this.selectobject = new EventEmitter<any>();
       }

       get displayObject() {
           return this._displayObject;
       }

       set displayObject(val) {
           //console.log('Setting display object to: ', val);
           this._displayObject = val;
       }

       getType():string {
           if (Array.isArray(this._displayObject)) {
               return 'array';
           }
           return typeof(this._displayObject);
       }

       getTheType(val:any) {
           return typeof(val);
       }

       isObject():boolean {
           return this.getType() === 'object';
       }

       isArray():boolean {
           return this.getType() === 'array';
       }

       // If we are getting only the 'first' property, the object being displayed is collapsed.  We
       // want to show at least one property and an expander.  We favor any property with the word
       // name at the beginning.  If none is found, just return the first property.

       getObjectProperties(firstOnly?:boolean):string[] {
           var props:string[] = [];

           if (!this.isObject()) {
               return props;
           }

           for (var prop in this.displayObject) {
               if (firstOnly && /.*name.*/.test(prop.toLowerCase())) {
                   return [prop];
               }
               props.push(prop);
           }

           return (firstOnly) ? props.slice(0,1) : props;
       }

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

       propNameToLabel(propName:string):string {

           if (!this.niceLabels) {
               return propName;
           }

           return this.parser.propertyNameToLabel(propName);
       }
}
