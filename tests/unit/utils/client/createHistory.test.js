import * as history from 'history'
import sinon from 'sinon'
import {expect} from 'chai'

import client from '../../../../src/utils/client'

describe('client.createHistory', () => {
  let browserHistory

  beforeEach(() => {
    browserHistory = sinon
      .stub(history, 'createBrowserHistory')
      .returns({
        getCurrentLocation: sinon.spy(),
        listen: sinon.spy(),
      })
  })

  it('does not create a history', () => {
    const result = () => client.createHistory()
    expect(result).to.throw(Error)
  })

  it('does not create a history with a piwik object', () => {
    const result = () => client.createHistory({matomo: {}})
    expect(result).to.throw(Error)
  })

  it('creates a history', () => {
    client.createHistory({})
    expect(browserHistory.calledWith()).to.be.true
  })

  it('creates a history with a basename', () => {
    client.createHistory({basename: '/'})
    expect(browserHistory.calledWith({basename: '/'})).to.be.true
  })

  it('creates a history with a piwik object', () => {
    const matomo = {url: 'https://matomo.example.com', siteId: 1}
    const history = client.createHistory({matomo})
    expect(history.listen.calledOnce).to.be.true
  })

  afterEach(() => {
    browserHistory.restore()
  })
})
