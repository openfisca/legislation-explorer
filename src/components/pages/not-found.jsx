import { Link, locationShape, routerShape } from "react-router"
import React, {PropTypes} from "react"
import DocumentTitle from "react-document-title"
import {FormattedMessage} from "react-intl"

const NotFoundPage = React.createClass({
  contextTypes: {
    router: routerShape.isRequired
  },

  propTypes: {
    location: locationShape.isRequired,
    message: PropTypes.string,
    countryPackageName: PropTypes.string
  },

  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
  },

  handleSubmit(event) {
    event.preventDefault()
    this.context.router.push({
      query: {q: this.state.inputValue},
      hash: `#search-input`,
    })
  },

  render() {
    const {pathname} = this.props.location
    const countryPackageName = this.props.countryPackageName
    const changelogURL = `http://www.github.com/openfisca/${countryPackageName}/blob/master/CHANGELOG.md`
    return (
      <DocumentTitle title={`Page non trouvée - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>
            <FormattedMessage id = "pageDoesNotExist" values=
              {{inputValueRef:`${pathname}`}}/>
            </h1>
          </div>
          <div className="alert alert-info">
            <p> <FormattedMessage id = "checkChangelog" values=
              {{changelogURLLink:
                <a href = {changelogURL} target = "_blank">changelog</a>
              }}/>
            </p>
          </div>
          <Link className="btn btn-default" to="/"><FormattedMessage id = "backToHP"/></Link>
          <hr></hr>
          <h3><FormattedMessage id = "explore"/></h3>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div className="input-group input-group-lg" style={{margin: "2em 0"}}>
                <input
                  className="form-control"
                  id="searchInputId"
                  placeholder="smic, salaire net…"
                  type="text"
                  onChange={this.handleInputChange}
                />
                <div className="input-group-btn">
                  <button className="btn btn-primary" type="submit" ><FormattedMessage id = "find"/></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

export default NotFoundPage
