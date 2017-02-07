import {Link} from "react-router"
import React, {PropTypes} from "react"

import BreadCrumb from "../breadcrumb"


const HomePage = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
  },
  render() {
    const {countryPackageName, countryPackageVersion} = this.props
    return (
      <section>
        <BreadCrumb />
        <div className="page-header">
          <h1>Explorateur de la législation</h1>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="thumbnail">
              <div className="caption">
                <h4>Variables et formules socio-fiscales</h4>
                <p>
                  Visualiser et rechercher parmi les variables d'entrée, les formules et leurs dépendences.
                </p>
                <p>
                  <a className="btn btn-primary" href="/graph/">Graphe »</a>
                  <span style={{marginLeft: 20}} />
                  <Link className="btn btn-default" to="/variables">Liste »</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="thumbnail">
              <div className="caption">
                <h4>Paramètres de la législation</h4>
                <p>
                  Visualiser et rechercher les paramètres de la législation et les formules qui les utilisent.
                </p>
                <p>
                  <Link className="btn btn-default" to="/parameters">Liste »</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <p>
            Les données affichées proviennent de {countryPackageName} version {countryPackageVersion}.
          </p>
        </div>
      </section>
    )
  },
})


export default HomePage
