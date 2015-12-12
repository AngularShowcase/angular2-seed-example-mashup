var Authentication = (function () {
    function Authentication() {
    }
    Authentication.prototype.isLoggedIn = function () {
        return !!this._user;
    };
    Object.defineProperty(Authentication.prototype, "user", {
        get: function () {
            return this._user;
        },
        set: function (val) {
            this._user = val;
        },
        enumerable: true,
        configurable: true
    });
    return Authentication;
})();
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map