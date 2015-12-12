var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var Parser_1 = require('../../services/Parser');
var ObjectDisplay = (function () {
    function ObjectDisplay(parser) {
        this.parser = parser;
        this.niceLabels = true;
        this.collapsed = false;
        this.displayObject = {};
        this.selectobject = new angular2_1.EventEmitter();
    }
    Object.defineProperty(ObjectDisplay.prototype, "displayObject", {
        get: function () {
            return this._displayObject;
        },
        set: function (val) {
            this._displayObject = val;
        },
        enumerable: true,
        configurable: true
    });
    ObjectDisplay.prototype.getType = function () {
        if (Array.isArray(this._displayObject)) {
            return "array";
        }
        return typeof (this._displayObject);
    };
    ObjectDisplay.prototype.getTheType = function (val) {
        return typeof (val);
    };
    ObjectDisplay.prototype.isObject = function () {
        return this.getType() === "object";
    };
    ObjectDisplay.prototype.isArray = function () {
        return this.getType() === "array";
    };
    ObjectDisplay.prototype.getObjectProperties = function (firstOnly) {
        var props = [];
        if (!this.isObject()) {
            return props;
        }
        for (var prop in this.displayObject) {
            if (firstOnly && /.*name.*/.test(prop.toLowerCase())) {
                return [prop];
            }
            props.push(prop);
        }
        return (firstOnly) ? props.slice(0, 1) : props;
    };
    ObjectDisplay.prototype.toggleCollapsed = function () {
        this.collapsed = !this.collapsed;
    };
    ObjectDisplay.prototype.objectClick = function (ev) {
        this.selectobject.next(this);
    };
    ObjectDisplay.prototype.objectSelected = function ($event) {
        this.selectobject.next($event);
    };
    ObjectDisplay.prototype.propNameToLabel = function (propName) {
        if (!this.niceLabels) {
            return propName;
        }
        return this.parser.propertyNameToLabel(propName);
    };
    ObjectDisplay = __decorate([
        angular2_1.Component({
            selector: 'object-display',
            viewInjector: [Parser_1.Parser],
            properties: ["displayObject:display-object", "niceLabels:nice-labels", "collapsed"],
            events: ['selectobject:selectobject']
        }),
        angular2_1.View({
            templateUrl: './components/objectDisplay/ObjectDisplay.html?v=<%= VERSION %>',
            directives: [angular2_1.NgFor, angular2_1.NgIf, angular2_1.NgSwitch, angular2_1.NgSwitchWhen, angular2_1.NgSwitchDefault, ObjectDisplay]
        }), 
        __metadata('design:paramtypes', [Parser_1.Parser])
    ], ObjectDisplay);
    return ObjectDisplay;
})();
exports.ObjectDisplay = ObjectDisplay;
//# sourceMappingURL=ObjectDisplay.js.map