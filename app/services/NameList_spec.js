var NameList_1 = require('./NameList');
function main() {
    describe('NameList Service', function () {
        var nameList;
        beforeEach(function () {
            nameList = new NameList_1.NamesList;
        });
        it('should return the list of names', function () {
            var names = nameList.get();
            expect(names).toEqual(jasmine.any(Array));
        });
    });
}
exports.main = main;
//# sourceMappingURL=NameList_spec.js.map