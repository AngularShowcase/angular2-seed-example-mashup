/// <reference path="../../tsd_typings/angular2/angular2.d.ts"/>
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
var CellDataServices = (function () {
    function CellDataServices(http) {
        this.http = http;
    }
    CellDataServices.prototype.getPeople = function () {
        var result = this.http.get('/api/people').toRx()
            .map(function (response) {
            console.log("people response", response);
            return response.json();
        });
        return result;
    };
    CellDataServices.prototype.savePerson = function (person) {
        var result = this.http.post('/api/people', JSON.stringify(person), this.getPostOptions());
        return result.toRx();
    };
    CellDataServices.prototype.getUsage = function () {
        var result = this.http.get('/api/usage').toRx()
            .map(function (response) {
            console.log("usage response", response);
            return response.json();
        });
        return result;
    };
    CellDataServices.prototype.saveUsage = function (newUsage) {
        var result = this.http.post('/api/usage', JSON.stringify(newUsage), this.getPostOptions());
        return result.toRx();
    };
    CellDataServices.prototype.getCyles = function () {
        var result = this.http.get('/api/cycles').toRx()
            .map(function (response) {
            console.log("cycles response", response);
            return response.json();
        });
        return result;
    };
    CellDataServices.prototype.saveCycle = function (newCycle) {
        var result = this.http.post('/api/cycles', JSON.stringify(newCycle), this.getPostOptions());
        return result.toRx();
    };
    CellDataServices.prototype.getPostOptions = function () {
        var headers = new angular2_1.Headers();
        headers.append("Content-Type", "application/json");
        var options = {
            headers: headers
        };
        return options;
    };
    CellDataServices = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof Http !== 'undefined' && Http) || Object])
    ], CellDataServices);
    return CellDataServices;
})();
exports.CellDataServices = CellDataServices;
//# sourceMappingURL=CellDataServices.js.map