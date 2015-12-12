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
var about_1 = require('./about');
var NameList_1 = require('../../services/NameList');
function main() {
    test_1.describe('About component', function () {
        test_1.it('should work', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
            tcb.overrideTemplate(TestComponent, '<div><about></about></div>')
                .createAsync(TestComponent)
                .then(function (rootTC) {
                rootTC.detectChanges();
                var aboutInstance = rootTC.componentViewChildren[0].componentInstance;
                var aboutDOMEl = rootTC.componentViewChildren[0].nativeElement;
                var nameListLen = function () {
                    return aboutInstance.list.names.length;
                };
                test_1.expect(aboutInstance.list).toEqual(jasmine.any(NameList_1.NamesList));
                test_1.expect(nameListLen()).toEqual(4);
                test_1.expect(dom_adapter_1.DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());
                aboutInstance.addName({ value: 'Minko' });
                rootTC.detectChanges();
                test_1.expect(nameListLen()).toEqual(5);
                test_1.expect(dom_adapter_1.DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());
                test_1.expect(dom_adapter_1.DOM.querySelectorAll(aboutDOMEl, 'li')[4].textContent).toEqual('Minko');
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
        angular2_1.Component({ selector: 'test-cmp', bindings: [NameList_1.NamesList] }),
        angular2_1.View({ directives: [about_1.About] }), 
        __metadata('design:paramtypes', [])
    ], TestComponent);
    return TestComponent;
})();
//# sourceMappingURL=about_spec.js.map