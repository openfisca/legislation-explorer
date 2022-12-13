import {expect} from 'chai'

import {addNormalizedDescription, findCountryModelItems} from '../../src/search'


const parameters = addNormalizedDescription({
  'aah': {description: 'Allocation adulte handicapé'},
  'cotisation': {description: 'cotisation payée sur le salaire (de base)'},
  'salaire_de_base': {description: 'Salaire brut'},
  'crds_salaire': {description: 'CRDS payée sur les salaires'},
  'super_brut': {description: 'Salaire super brut'},
  'rsa_base_ressource': {description: 'Base ressource du RSA (salaires, chômage...)'},
})

describe('findCountryModelItems', () => {
  describe('Searching a single word', () => {
    const items = findCountryModelItems({}, parameters, {}, 'salaire')
    const itemNames = items.map(item => item.name)

    it('filters variables that don’t contain query', () => {
      expect(itemNames).not.to.include.members(['aah'])
    })

    it('prioritises items key word in their name', () => {
      expect(itemNames).to.include.ordered.members(['salaire_de_base', 'crds_salaire'])
    })

    it('prioritises items with the key word earlier in the description', () => {
      expect(itemNames.slice(2)).to.include.ordered.members(['super_brut', 'rsa_base_ressource'])
    })
  })

  describe('Searching multiple words', () => {
    const items = findCountryModelItems({}, parameters, {}, 'salaire base')
    const itemNames = items.map(item => item.name)

    it('prioritises items with all the words in their name', () => {
      expect(itemNames).to.include.ordered.members(['salaire_de_base', 'rsa_base_ressource'])
    })

    it('prioritise items with all the words in their description', () => {
      expect(itemNames.slice(1)).to.include.ordered.members(['rsa_base_ressource', 'cotisation'])
    })
  })
})

