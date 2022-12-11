import React from 'react';
import Formula from '../../src/components/formula'
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import {flatten} from 'ramda'
import {Link} from 'react-router-dom'
import should from 'should'
import fs from 'fs'
import path from 'path'
configure({ adapter: new Adapter() });

const variables = {
    rsa: {},
    rsa_base_ressource: {},
    rsa_fictif: {},
    rsa_eligible: {},
    scolarite: {},
    bourse_college_echelon: {},
}

const parameters = {
    'prestations.prestations_familiales.af.bmaf': {},
    'bourses_education.bourse_college.montant_taux_3': {},
    'bourses_education.bourse_college.montant_taux_2': {},
    'bourses_education.bourse_college.montant_taux_1': {}
}

const variable = {id: 'rsa'}

const component = shallow(<Formula variable={variable} variables={variables} parameters={parameters} content="" />).instance()

function splitAndLinkParams(formula) {
    return shallow(<div>{component.splitAndLinkParams(formula)}</div>)
}


describe('Add links to parameters', function(){
    it ('should return one link when there is one leaf', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula2.txt")).toString()
        const output = splitAndLinkParams(formula_content)
        const links = output.find(Link)
        links.should.have.length(1)
        links.get(0).props.to.should.equal('prestations.prestations_familiales.af.bmaf')
    })
    it ('should return a link for each parameter present', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula1.txt")).toString()
        const output = splitAndLinkParams(formula_content)
        const links = output.find(Link)
        links.should.have.length(4)
        links.get(0).props.to.should.equal('prestations.prestations_familiales.af.bmaf')
        links.get(1).props.to.should.equal('bourses_education.bourse_college.montant_taux_3')
        links.get(2).props.to.should.equal('bourses_education.bourse_college.montant_taux_2')
        links.get(3).props.to.should.equal('bourses_education.bourse_college.montant_taux_1')
    })
    it ('should return a link when embeded in several nodes', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula4.txt")).toString()
        const output = splitAndLinkParams(formula_content)
        const links = output.find(Link)
        links.should.have.length(1)
        links.get(0).props.to.should.equal('prestations.prestations_familiales.af.bmaf')
    })
})

function renderLinkedFormula(formula) {
    return shallow(<div>{component.renderLinkedFormula(formula)}</div>)
}

describe('Add links to the whole formula', function(){

    it ('should return 2 links when there is very one parameter and one variable', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula3.txt")).toString()
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(2)
        links.get(0).props.to.should.equal('rsa_eligible')
        links.get(1).props.to.should.equal('prestations.prestations_familiales.af.bmaf')

    })
    it ('should return 2 links when there is one parameter and one variable and a node', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula2.txt")).toString()
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(2)
        links.get(0).props.to.should.equal('rsa_eligible')
        links.get(1).props.to.should.equal('prestations.prestations_familiales.af.bmaf')
    })
    it ('should return 6 links', function(){
        const formula_content = fs.readFileSync(path.join(__dirname, "assets", "formula1.txt")).toString()
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(6)
        links.get(0).props.to.should.equal('prestations.prestations_familiales.af.bmaf')
        links.get(1).props.to.should.equal('scolarite')
        links.get(2).props.to.should.equal('bourse_college_echelon')
        links.get(3).props.to.should.equal('bourses_education.bourse_college.montant_taux_3')
        links.get(4).props.to.should.equal('bourses_education.bourse_college.montant_taux_2')
        links.get(5).props.to.should.equal('bourses_education.bourse_college.montant_taux_1')
    })

})

describe('Link rendering in variables', function() {
    it('should add links to a variables with double quotes', function() {
        const formula_content = 'simulation.calculate("rsa_base_ressource")'
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(1)
        links.get(0).props.to.should.equal('rsa_base_ressource')
    });
    it('should add links to a variables with simple quotes', function() {
        const formula_content = 'simulation.calculate(\'rsa_base_ressource\')'
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(1)
        links.get(0).props.to.should.equal('rsa_base_ressource')
    });

    it('should handle simple quotes and double quotes mixed', function() {
        const formula_content = 'simulation.calculate(\'rsa_base_ressource\') simulation.calculate("rsa_fictif") simulation.calculate(\'rsa_eligible\')'
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(3)
        links.get(0).props.to.should.equal('rsa_base_ressource');
        links.get(1).props.to.should.equal('rsa_fictif');
        links.get(2).props.to.should.equal('rsa_eligible');
    });

    it('should be robust to quotes in comments', function() {
        const formula_content = ' # This a a comment with a quote \' simulation.calculate(\'rsa_base_ressource\') simulation.calculate(\'rsa_eligible\')'
        const output = renderLinkedFormula(formula_content)
        const links = output.find(Link)
        links.should.have.length(2)
        links.get(0).props.to.should.equal('rsa_base_ressource');
        links.get(1).props.to.should.equal('rsa_eligible');
    });
});
