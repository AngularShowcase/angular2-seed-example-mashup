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
var test_1 = require('angular2/test');
var angular2_1 = require('angular2/angular2');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var home_1 = require('./home');
function main() {
    test_1.describe('Home component', function () {
        test_1.it('should work', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
            tcb.overrideTemplate(TestComponent, '<div><home></home></div>')
                .createAsync(TestComponent)
                .then(function (rootTC) {
                var homeDOMEl = rootTC.componentViewChildren[0].nativeElement;
                test_1.expect(dom_adapter_1.DOM.querySelectorAll(homeDOMEl, 'h1')[0].textContent).toEqual('Howdy!');
                async.done();
            });
        }));
    });
}
exports.main = main;
;
var TestComponent = (function () {
    function TestComponent() {
    }
    TestComponent = __decorate([
        angular2_1.Component({ selector: 'test-cmp' }),
        angular2_1.View({ directives: [home_1.Home] }), 
        __metadata('design:paramtypes', [])
    ], TestComponent);
    return TestComponent;
})();
//# sourceMappingURL=home_spec.js.map