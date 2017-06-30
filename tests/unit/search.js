const search = require("../../src/search")

describe('Search', function() {
    it('should not crash', function() {
        search.findParametersAndVariables({}, {}, "");
    });
});
