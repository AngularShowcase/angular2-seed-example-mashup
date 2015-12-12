/// <reference path="../../tsd_typings/tsd.d.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var di_1 = require('angular2/di');
var http_1 = require('http/http');
var AnimalServices = (function () {
    function AnimalServices(http) {
        this.http = http;
    }
    AnimalServices.prototype.getQuestions = function () {
        var httpRet = this.http.get('/api/animals/questions');
        var result = httpRet.toRx()
            .map(function (response) {
            console.log("animal questions response", response);
            return response.json();
        });
        return result;
    };
    AnimalServices.prototype.getRootQuestion = function () {
        var result = this.http.get("/api/animals/questions/root").toRx()
            .map(function (response) { return response.json(); });
        return result;
    };
    AnimalServices.prototype.getQuestion = function (questionId) {
        var result = this.http.get("/api/animals/questions/" + questionId).toRx()
            .map(function (response) {
            console.log(response);
            if (response.status != 200) {
                throw Error(response._body);
            }
            return response.json();
        });
        return result;
    };
    AnimalServices.prototype.addNewAnimal = function (newAnimalInfo) {
        var result = this.http.post("/api/animals", JSON.stringify(newAnimalInfo), this.getPostOptions())
            .toRx()
            .map(function (response) { return response.json(); });
        return result;
    };
    AnimalServices.prototype.getPostOptions = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        var options = {
            headers: headers
        };
        return options;
    };
    AnimalServices = __decorate([
        di_1.Injectable()
    ], AnimalServices);
    return AnimalServices;
})();
exports.AnimalServices = AnimalServices;
