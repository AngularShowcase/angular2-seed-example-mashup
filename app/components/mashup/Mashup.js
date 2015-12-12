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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
var angular2_2 = require('angular2/angular2');
var Rx = require('rx');
var ObjectDisplay_1 = require('../objectDisplay/ObjectDisplay');
var GithubServices_1 = require('../../services/GithubServices');
var GithubUser_1 = require('../../models/GithubUser');
var http_1 = require('http/http');
var Mashup = (function () {
    function Mashup(http, githubServices) {
        this.githubServices = githubServices;
        this.minNameLength = 8;
        this.currentNameLength = 0;
        this.http = http;
        this.userInfo = new GithubUser_1.GithubUser();
        this.userDisplayData = {
            name: 'Howard',
            sports: ['lacrosse', 'bowling',
                { name: 'football',
                    rank: 1,
                    players: [
                        "Randy",
                        { FirstName: 'Howard',
                            LastName: 'Pinsley',
                            Skills: ['Quarterback', 'WideReceiver', { Position: 'Running Back', Level: 'Expert' }]
                        },
                        "David"
                    ]
                },
                "Tetherball"
            ]
        };
        this.reposDisplayData = {};
        this.setNameLookup();
    }
    Mashup.prototype.setNameLookup = function () {
        var _this = this;
        this.nameUpdate = new Rx.Subject();
        this.nameUpdate.subscribe(function (name) { return _this.currentNameLength = name ? name.length : 0; });
        var namePub = this.nameUpdate
            .where(function (name) { return name.length >= _this.minNameLength; })
            .flatMap(function (name) { return _this.githubServices.getUser(name); });
        namePub.subscribe(this.setUser.bind(this), function (error) { return console.log("Error", error); });
        var repoPub = namePub.flatMap(function (user) { return _this.githubServices.lookupRepo(user); });
        repoPub.subscribe(this.setRepos.bind(this), function (error) { return console.log("repos error", error); });
    };
    Mashup.prototype.objectSelected = function (objDisplay) {
        if (objDisplay.getType() === "string" && /https?:/.test(objDisplay.displayObject)) {
            var url = objDisplay.displayObject;
            console.log('Following url: ', url);
            this.http.get(url).toRx()
                .map(function (response) { return response.json(); })
                .subscribe(function (data) { return objDisplay.displayObject = { url: url, data: data }; }, function (error) { return console.log("Error", error); });
        }
    };
    Mashup.prototype.setUser = function (user) {
        console.log("Got a user", user);
        this.userInfo = user;
        this.userDisplayData = user;
    };
    Mashup.prototype.setRepos = function (repos) {
        console.log("Repos", repos);
        this.reposDisplayData = repos;
    };
    Mashup.prototype.onKeyUp = function (name) {
        this.nameUpdate.onNext(name.value);
    };
    Mashup = __decorate([
        angular2_1.Component({
            selector: 'mashup',
            bindings: [http_1.HTTP_BINDINGS, angular2_1.Http, GithubServices_1.GithubServices]
        }),
        angular2_1.View({
            templateUrl: './components/mashup/Mashup.html?v=<%= VERSION %>',
            directives: [angular2_1.NgFor, ObjectDisplay_1.ObjectDisplay, angular2_2.FORM_DIRECTIVES]
        }),
        __param(0, angular2_1.Inject(angular2_1.Http)), 
        __metadata('design:paramtypes', [Object, GithubServices_1.GithubServices])
    ], Mashup);
    return Mashup;
})();
exports.Mashup = Mashup;
//# sourceMappingURL=Mashup.js.map