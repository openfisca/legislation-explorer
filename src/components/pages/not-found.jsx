import { Link, locationShape, routerShape } from "react-router"
import React, {PropTypes} from "react"
import DocumentTitle from "react-document-title"
import {FormattedMessage} from "react-intl"
import SearchBarComponent from "./searchbar"
import config from "../../config"


const NotFoundPage = React.createClass({
  contextTypes: {
    router: routerShape.isRequired
  },

  propTypes: {
    location: locationShape.isRequired,
    message: PropTypes.string,
  },

  render() {
    const {pathname} = this.props.location
    const changelogURL = `https://www.github.com/${config.gitHubProject}/blob/master/CHANGELOG.md`
    return (
      <DocumentTitle title={`Page non trouvée - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>
            <FormattedMessage
              id="pageDoesNotExist"
              values={{inputValueRef: `${pathname}`}}
            />
            </h1>
          </div>
          <div className="alert alert-info">
            <p>
              <FormattedMessage
                id="checkChangelog"
                values={{changelogURLLink: <a href={changelogURL} target="_blank">changelog</a>}}
              />
            </p>
          </div>
          <Link className="btn btn-default" to="/"><FormattedMessage id="backToHP"/></Link>
          <hr></hr>
          <h3><FormattedMessage id="explore"/></h3>
          <SearchBarComponent/>
        </div>
      </DocumentTitle>
    )
  },
})


export default NotFoundPage
