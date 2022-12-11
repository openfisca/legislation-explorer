import sinon from 'sinon'
import {JSDOM} from 'jsdom'
import {expect} from 'chai'

import client from '../../../../src/utils/client'

describe('client.hashLinkScroll', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><body></body></html>')
    dom.window.HTMLElement.prototype.scrollIntoView = sinon.stub()
    dom.window.scrollTo = sinon.stub()
    global.window = dom.window
    global.document = dom.window.document
  })

  it('does not scroll to the element if it does not exist', () => {
    window.location.hash = '#test'
    client.hashLinkScroll()
    expect(window.scrollTo.called).to.be.false
  })

  it('scrolls to the top of the page if there is no hash', () => {
    window.location.hash = ''
    client.hashLinkScroll()
    expect(window.scrollTo.calledOnce).to.be.true
    expect(window.scrollTo.calledWith(0, 0)).to.be.true
  })

  it('scrolls to the element with the given id', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    element.id = 'test'
    window.location.hash = '#test'
    client.hashLinkScroll()
    expect(element.scrollIntoView.calledOnce).to.be.true
  })

  it('handles special characters in the hash value', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    element.id = 'my-id-with-spaces-and-punctuation'
    window.location.hash = '#my-id-with-spaces-and-punctuation!'
    client.hashLinkScroll()
    expect(element.scrollIntoView.calledOnce).to.be.true
  })
})
