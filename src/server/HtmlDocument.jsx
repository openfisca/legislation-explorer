import DocumentTitle from "react-document-title";
import React, { PropTypes } from "react";


class HtmlDocument extends React.Component {

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
    const {appHtml, css, scripts} = this.props;
    return (
      <html>
        <head>
          <meta content="width=device-width, initial-scale=1.0, user-scalable=no" name="viewport" />
          <title>{ DocumentTitle.rewind() }</title>
          {css.map((href, k) => <link href={href} key={k} rel="stylesheet" type="text/css" />)}
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: appHtml}} id="app-mount-node" />
          {scripts.map((src, idx) => <script key={idx} src={src} />)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
