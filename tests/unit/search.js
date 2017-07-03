import {addNormalizedDescription, findParametersAndVariables} from '../../src/search'
import {equals} from "ramda"
import assert from "assert"
import should from "should"

const parameters = addNormalizedDescription({
    'aah': {description: 'Allocation adulte handicapé'},
    'cotisation': {description: 'cotisation payée sur le salaire'},
    'salaire_de_base': {description: 'Salaire brut'},
    'crds_salaire': {description: 'CRDS payée sur les salaires'},
    'super_brut': {description: 'Salaire super brut'},
});

describe('Searching a single word', function() {
    const results = findParametersAndVariables(parameters, {}, 'salaire')
        .map(item => item.name);
    it('should filter variables that don’t contain the query', function() {
        results.should.not.containEql('aah');
    });

    it('should first prioritize items with the key word in their name', function() {
        results.should.containDeepOrdered(['crds_salaire', 'super_brut']);
    });

    it('should then prioritize items with the key word earlier in the name', function() {
        results.should.containDeepOrdered(['salaire_de_base', 'crds_salaire']);
    });

    it('should finally prioritize items with the key word earlier in the description', function() {
        results.should.containDeepOrdered(['super_brut', 'cotisation']);
    });
});

describe('Searching several words', function() {
    const results = findParametersAndVariables(parameters, {}, 'salaire base')
        .map(item => item.name);
    it('should only return variables that contain all query words', function() {
        results.sort().should.be.eql(['salaire_de_base']);
    });
});
