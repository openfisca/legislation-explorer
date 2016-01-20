import DocumentTitle from "react-document-title"
import React, {Component, PropTypes} from "react"


class HtmlDocument extends Component {
  static propTypes = {
    appHtml: PropTypes.string.isRequired,
    css: PropTypes.arrayOf(PropTypes.string),
    scripts: PropTypes.arrayOf(PropTypes.string),
  }
  static defaultProps = {
    css: [],
    script: [],
  }
  render() {
    const {appHtml, css, scripts} = this.props
    return (
      <html>
        <head>
          <meta content="width=device-width, initial-scale=1.0, user-scalable=no" name="viewport" />
          <title>{DocumentTitle.rewind()}</title>
          {css.map((href, key) => <link href={href} key={key} rel="stylesheet" type="text/css" />)}
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: appHtml}} id="app-mount-node" />
          {scripts.map((src, idx) => <script key={idx} src={src} />)}
          <script>
            window.isPageRenderedOnServer = true
          </script>
        </body>
      </html>
    )
  }
}

export default HtmlDocument
