var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var angular2_1 = require('angular2/angular2');
var angular2_2 = require('angular2/angular2');
var YesNo = (function () {
    function YesNo() {
        this.yes = new angular2_1.EventEmitter();
        this.no = new angular2_1.EventEmitter();
        this.answer = new angular2_1.EventEmitter();
    }
    YesNo.prototype.yesClick = function () {
        this.yes.next('y');
        this.answer.next('y');
    };
    YesNo.prototype.noClick = function () {
        this.no.next('n');
        this.answer.next('n');
    };
    YesNo = __decorate([
        angular2_1.Component({
            selector: 'yes-no',
            bindings: [],
            properties: [],
            events: ['yes', 'no', 'answer']
        }),
        angular2_1.View({
            templateUrl: './components/common/YesNo.html',
            directives: [angular2_2.FORM_DIRECTIVES, angular2_2.NgClass],
            styleUrls: ['./components/common/YesNo.css']
        })
    ], YesNo);
    return YesNo;
})();
exports.YesNo = YesNo;
