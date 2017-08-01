import { Link, locationShape, routerShape } from "react-router"
import React, {PropTypes} from "react"
import DocumentTitle from "react-document-title"

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
    const message = this.props.message || `La page « ${pathname} » n'existe pas.`
    const countryPackageName = this.props.countryPackageName
    const changelogURL = `http://www.github.com/openfisca/${countryPackageName}/blob/master/CHANGELOG.md`
    return (
      <DocumentTitle title={`Page non trouvée - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>La page « {pathname} » n'existe pas.</h1>
          </div>
          <div className="alert alert-info">
            <p>{message}</p>
            <p>Vérifiez l'orthographe de l'URL.</p>
            <p>Si ce lien fonctionnait et ne fonctionne plus, vérifiez le <a href={changelogURL}>changelog</a>.</p>
          </div>
          <Link className="btn btn-default" to="/">Retour à l'accueil</Link>
          <hr></hr>
          <h3>Explorez la base de paramètres et variables OpenFisca</h3>
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
                  <button className="btn btn-primary" type="submit" >Trouver</button>
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
