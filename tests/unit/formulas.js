import React from 'react';
import Variable from '../../src/components/variable'
import { shallow } from 'enzyme';
import {flatten} from 'ramda'
import {Link} from "react-router"
import should from "should"

const variables = {
    rsa: {},
    rsa_base_ressource: {},
    rsa_fictif: {},
    rsa_eligible: {},
}

const parameters = {
    "prestations.prestations_familiales.af.bmaf": {},
    "bourses_education.bourse_college.montant_taux_3": {}
}

const variable = {id: 'rsa'}
const component = shallow(<Variable variable={variable} variables={variables} parameters={parameters} />).instance()
describe('Parameter checking', function(){
    it ('should return true when given a parameter', function(){
        const substring = 'parameters(period.this_year.first_month).prestations.prestations_familiales.af.bmaf '
        const output = component.isParameterCall(substring)
        output.should.be.true()
    })
    it ('should return false when given a random string', function(){
        const substring = "scolarite_i = famille.members('scolarite',"
        const output = component.isParameterCall(substring)
        output.should.be.false()
    })
    it ('should return true when parameter node is a leaf', function(){
        const substring = 'parameters(period.this_year.first_month).prestations.prestations_familiales.af.bmaf'
        const output = component.isParameterLeaf(substring)
        output.should.be.ok()
    })
    it('should return false if parameter is a node', function(){
        const substring = 'P = parameters(period).bourses_education.bourse_college'
        const output = component.isParameterLeaf(substring)
        should(output).not.be.ok()

    })
})
// function renderLinkedFormulaVariables(formula) {
//     return shallow(<div>{component.renderLinkedFormulaVariables(formula)}</div>)
// }

// describe('Link rendering in variables', function() {
//     it('should add links to a variables with double quotes', function() {
//         const formula = 'simulation.calculate("rsa_base_ressource")'
//         const output = renderLinkedFormulaVariables(formula)
//         const links = output.find(Link)
//         links.should.have.length(1)
//         links.get(0).props.to.should.equal('rsa_base_ressource')
//     });

//     it('should add links to a variables with simple quotes', function() {
//         const formula = 'simulation.calculate(\'rsa_base_ressource\')'
//         const output = renderLinkedFormulaVariables(formula)
//         const links = output.find(Link)
//         links.should.have.length(1)
//         links.get(0).props.to.should.equal('rsa_base_ressource')
//     });

//     it('should handle simple quotes and double quotes mixed', function() {
//         const formula = 'simulation.calculate(\'rsa_base_ressource\') simulation.calculate("rsa_fictif") simulation.calculate(\'rsa_eligible\')'
//         const output = renderLinkedFormulaVariables(formula)
//         const links = output.find(Link)
//         links.should.have.length(3)
//         links.get(0).props.to.should.equal('rsa_base_ressource');
//         links.get(1).props.to.should.equal('rsa_fictif');
//         links.get(2).props.to.should.equal('rsa_eligible');
//     });

//     it('should be robust to quotes in comments', function() {
//         const formula = ' # This a a comment with a quote \' simulation.calculate(\'rsa_base_ressource\') simulation.calculate(\'rsa_eligible\')'
//         const output = renderLinkedFormulaVariables(formula)
//         const links = output.find(Link)
//         links.should.have.length(2)
//         links.get(0).props.to.should.equal('rsa_base_ressource');
//         links.get(1).props.to.should.equal('rsa_eligible');
//     });
// });
