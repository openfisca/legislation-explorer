import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import fs from 'fs'
import path from 'path'
import {Link} from 'react-router'
import {configure, shallow} from 'enzyme'
import {expect} from 'chai'

import Formula from '../../src/components/formula'

configure({adapter: new Adapter()})

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

const component = shallow(<Formula variable={variable} variables={variables} parameters={parameters} content=""/>).instance()

function splitAndLinkParams(formula) {
  return shallow(<div>{component.splitAndLinkParams(formula)}</div>)
}


describe('Add links to parameters', () => {
  it('return one link when there is one leaf', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula2.txt')).toString()
    const output = splitAndLinkParams(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(1)
    expect(links.get(0).props).to.include({children: 'prestations.prestations_familiales.af.bmaf'})
  })

  it('return a link for each parameter present', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula1.txt')).toString()
    const output = splitAndLinkParams(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(4)
    expect(links.get(0).props).to.include({to: 'prestations.prestations_familiales.af.bmaf'})
    expect(links.get(1).props).to.include({to: 'bourses_education.bourse_college.montant_taux_3'})
    expect(links.get(2).props).to.include({to: 'bourses_education.bourse_college.montant_taux_2'})
    expect(links.get(3).props).to.include({to: 'bourses_education.bourse_college.montant_taux_1'})
  })

  it('return a link when embeded in several nodes', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula4.txt')).toString()
    const output = splitAndLinkParams(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(1)
    expect(links.get(0).props).to.include({to: 'prestations.prestations_familiales.af.bmaf'})
  })
})

function renderLinkedFormula(formula) {
  return shallow(<div>{component.renderLinkedFormula(formula)}</div>)
}

describe('Add links to the whole formula', () => {
  it('return 2 links when there is very one parameter and one variable', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula2.txt')).toString()
    const output = renderLinkedFormula(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(2)
    expect(links.get(0).props).to.include({to: 'rsa_eligible'})
    expect(links.get(1).props).to.include({to: 'prestations.prestations_familiales.af.bmaf'})
  })

  it('return 2 links when there is one parameter and one variable and a node', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula2.txt')).toString()
    const output = renderLinkedFormula(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(2)
    expect(links.get(0).props).to.include({to: 'rsa_eligible'})
    expect(links.get(1).props).to.include({to: 'prestations.prestations_familiales.af.bmaf'})
  })

  it('return 6 links', () => {
    const formula_content = fs.readFileSync(path.join(__dirname, 'assets', 'formula1.txt')).toString()
    const output = renderLinkedFormula(formula_content)
    const links = output.find(Link)
    expect(links).to.have.length(6)
    expect(links.get(0).props).to.include({to: 'prestations.prestations_familiales.af.bmaf'})
    expect(links.get(1).props).to.include({to: 'scolarite'})
    expect(links.get(2).props).to.include({to: 'bourse_college_echelon'})
    expect(links.get(3).props).to.include({to: 'bourses_education.bourse_college.montant_taux_3'})
    expect(links.get(4).props).to.include({to: 'bourses_education.bourse_college.montant_taux_2'})
    expect(links.get(5).props).to.include({to: 'bourses_education.bourse_college.montant_taux_1'})
  })

  describe('Link rendering in variables', () => {
    it('add links to a variables with double quotes', () => {
      const formula_content = 'simulation.calculate("rsa_base_ressource")'
      const output = renderLinkedFormula(formula_content)
      const links = output.find(Link)
      expect(links).to.have.length(1)
      expect(links.get(0).props).to.include({to: 'rsa_base_ressource'})
    })

    it('add links to a variables with simple quotes', () => {
      const formula_content = 'simulation.calculate(\'rsa_base_ressource\')'
      const output = renderLinkedFormula(formula_content)
      const links = output.find(Link)
      expect(links).to.have.length(1)
      expect(links.get(0).props).to.include({to: 'rsa_base_ressource'})
    })

    it('handle simple quotes and double quotes mixed', () => {
      const formula_content = 'simulation.calculate(\'rsa_base_ressource\') simulation.calculate("rsa_fictif") simulation.calculate(\'rsa_eligible\')'
      const output = renderLinkedFormula(formula_content)
      const links = output.find(Link)
      expect(links).to.have.length(3)
      expect(links.get(0).props).to.include({to: 'rsa_base_ressource'})
      expect(links.get(1).props).to.include({to: 'rsa_fictif'})
      expect(links.get(2).props).to.include({to: 'rsa_eligible'})
    })

    it('should be robust to quotes in comments', () => {
      const formula_content = ' # This a a comment with a quote \' simulation.calculate(\'rsa_base_ressource\') simulation.calculate(\'rsa_eligible\')'
      const output = renderLinkedFormula(formula_content)
      const links = output.find(Link)
      expect(links).to.have.length(2)
      expect(links.get(0).props).to.include({to: 'rsa_base_ressource'})
      expect(links.get(1).props).to.include({to: 'rsa_eligible'})
    })
  })
})
