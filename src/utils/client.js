import ReactPiwik from 'react-piwik'
import {createBrowserHistory} from 'history'


/**
 * Scrolls to the element specified when there is a hash in the URL.
 * If there is no hash, scrolls to the top of the page.
 * Adapted from: https://github.com/ReactTraining/react-router/issues/394#issuecomment-230116115
 */
const hashLinkScroll = (): void => {
  const { hash } = window.location

  if (hash === '') {
    window.scrollTo(0, 0)
  }

  else {
    const id = hash.replace(/[^\-#0-9a-z]/gi, '')
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }
}

const createHistory = ({ pathname, matomo }) => {
  const history = createBrowserHistory({ basename: pathname })

  if (!matomo) {
    return history
  }

  const piwik = new ReactPiwik({
    url: matomo.url,
    siteId: parseFloat(matomo.siteId),
  })

  return piwik.connectToHistory(history)
}


export default {createHistory, hashLinkScroll}
