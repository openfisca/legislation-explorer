import {addNormalizedDescription, findParametersAndVariables} from '../../src/search'
import {equals} from "ramda"
import assert from "assert"

const parameters = addNormalizedDescription({
    'aah': {description: 'Allocation adulte handicapé'},
    'cotisation': {description: 'cotisation payée sur le salaire'},
    'salaire_de_base': {description: 'Salaire brut'},
});

describe('Search', function() {
    it('should filter variables that don’t contain the query', function() {
        const results = findParametersAndVariables(parameters, {}, 'salaire')
            .map(item => item.name);
        assert(equals(results, ['salaire_de_base', 'cotisation']))
    });
});
