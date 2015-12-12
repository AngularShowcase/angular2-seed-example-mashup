var NamesList = (function () {
    function NamesList() {
        this.names = ['Dijkstra', 'Knuth', 'Turing', 'Hopper'];
    }
    NamesList.prototype.get = function () {
        return this.names;
    };
    NamesList.prototype.add = function (value) {
        this.names.push(value);
    };
    return NamesList;
})();
exports.NamesList = NamesList;
//# sourceMappingURL=NameList.js.map