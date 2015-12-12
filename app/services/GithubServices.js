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
var GithubServices = (function () {
    function GithubServices(http) {
        this.http = http;
    }
    GithubServices.prototype.getUser = function (login) {
        console.log("Looking up Github login " + login);
        var url = "https://api.github.com/users/" + login;
        var result = this.http.get(url).toRx()
            .map(function (response) {
            console.log("user response", response);
            return response.json();
        });
        return result;
    };
    GithubServices.prototype.lookupRepo = function (user) {
        var repos_url = user.repos_url;
        console.log("Looking up Github repos at ", repos_url);
        var result = this.http.get(repos_url).toRx()
            .map(function (response) {
            console.log("repo response", response);
            return response.json();
        });
        return result;
    };
    GithubServices = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof Http !== 'undefined' && Http) || Object])
    ], GithubServices);
    return GithubServices;
})();
exports.GithubServices = GithubServices;
//# sourceMappingURL=GithubServices.js.map