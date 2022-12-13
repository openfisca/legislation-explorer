import {expect} from 'chai'

import search from '../../../../src/utils/search'


describe('search.addNormalizedDescription', () => {
  it('adds normalised description', () => {
    const result = search.addNormalizedDescription({
      name: {description: 'This is a description'},
    })

    expect(result).to.deep.equal({
      name: {
        description: 'This is a description',
        normalizedDescription: 'this is a description',
      },
    })
  })
})
