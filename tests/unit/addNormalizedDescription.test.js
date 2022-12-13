import {expect} from 'chai'

import {addNormalizedDescription} from '../../src/search'


describe('addNormalizedDescription', () => {
  it('adds normalised description', () => {
    const result = addNormalizedDescription({
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
