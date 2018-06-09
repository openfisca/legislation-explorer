import DocumentTitle from "react-document-title"
import React, {Component} from "react"
import PropTypes from 'prop-types'

export default class HtmlDocument extends Component {
  render() {
    const {appHtml, cssUrls, appInitialState, jsUrls} = this.props
    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0, user-scalable=no" name="viewport" />
          <title>{DocumentTitle.rewind()}</title>
          {cssUrls && cssUrls.map((href, key) => <link href={href} key={key} rel="stylesheet" type="text/css" />)}
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: appHtml}} id="app-mount-node" />
          {
            appInitialState && (
              <script
                dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${JSON.stringify(appInitialState)}`}}
              />
            )
          }
          {jsUrls && jsUrls.map((src, idx) => <script key={idx} src={src} />)}
        </body>
      </html>
    )
  }
}

HtmlDocument.propTypes = {
  appHtml: PropTypes.string.isRequired,
  appInitialState: PropTypes.object,
  cssUrls: PropTypes.arrayOf(PropTypes.string),
  jsUrls: PropTypes.arrayOf(PropTypes.string),
}
