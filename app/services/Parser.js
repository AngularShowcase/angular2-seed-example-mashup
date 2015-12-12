var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.propertyNameToLabel = function (propName) {
        if (!propName) {
            return propName;
        }
        var allUpper = propName.toUpperCase();
        if (propName === allUpper) {
            return propName;
        }
        var pieces;
        pieces = propName.split("_");
        if (pieces.length > 1) {
            return pieces.map(this.propertyNameToLabel).join(" ");
        }
        pieces = [];
        var remaining = propName;
        var index;
        var upperLetter = /.[A-Z]/;
        while ((index = remaining.search(upperLetter)) > -1) {
            var word = remaining.slice(0, index + 1);
            pieces.push(word);
            remaining = remaining.substr(index + 1);
        }
        pieces.push(remaining);
        return pieces.map(function (word) { return word.slice(0, 1).toUpperCase() + word.slice(1); }).join(" ");
    };
    return Parser;
})();
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map