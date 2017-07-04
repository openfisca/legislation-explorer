import React from 'react';
import Variable from '../../src/components/variable'
import { shallow } from 'enzyme';
import {flatten} from 'ramda'
import {Link} from "react-router"
import should from "should"

const variables = {
    rsa: {},
    rsa_base_ressource: {},
}
const variable = {id: 'rsa'}
const component = shallow(<Variable variable={variable} variables={variables} />).instance()
function renderLinkedFormulaVariables(formula) {
    return shallow(<div>{component.renderLinkedFormulaVariables(formula)}</div>)
}

describe('Link rendering in variables', function() {
    it('should add links to a variables with double quotes', function() {
        const formula = 'simulation.calculate("rsa_base_ressource")'
        const output = renderLinkedFormulaVariables(formula)
        output.find(Link).should.have.length(1);
        const link = output.find(Link).first();
        link.props().to.should.equal("rsa_base_ressource");
    });
});
