import search from '../../../../src/utils/search'


const parameters = search.addNormalizedDescription({
  'aah': {description: 'Allocation adulte handicapé'},
  'cotisation': {description: 'cotisation payée sur le salaire (de base)'},
  'salaire_de_base': {description: 'Salaire brut'},
  'crds_salaire': {description: 'CRDS payée sur les salaires'},
  'super_brut': {description: 'Salaire super brut'},
  'rsa_base_ressource': {description: 'Base ressource du RSA (salaires, chômage...)'},
})

describe('search.findCountryModelItems', () => {
  describe('Searching a single word', () => {
    const items = search.findCountryModelItems({}, parameters, {}, 'salaire')
    const itemNames = items.map(item => item.name)

    it('filters variables that don’t contain the query', () => {
      itemNames.should.not.containEql('aah');
    })

    it('first prioritises items with the key word in their name', () => {
      itemNames.should.containDeepOrdered(['crds_salaire', 'super_brut']);
    })

    it('then prioritises items with the key word earlier in the name', () => {
      itemNames.should.containDeepOrdered(['salaire_de_base', 'crds_salaire']);
    })

    it('finally prioritises items with the key word earlier in the description', () => {
      itemNames.should.containDeepOrdered(['super_brut', 'cotisation']);
    })
  })

  describe('Searching multiple words', () => {
    const items = search.findCountryModelItems({}, parameters, {}, 'salaire base')
    const itemNames = items.map(item => item.name)

    it('prioritises items with all the words in their name', () => {
      itemNames.should.containDeepOrdered(['salaire_de_base', 'rsa_base_ressource'])
    })

    it('prioritise items with all the words in their description', () => {
      itemNames.should.containDeepOrdered(['rsa_base_ressource', 'cotisation'])
    })
  })
})

