import {Link} from "react-router";
import React from "react";

import BreadCrumb from "../breadcrumb";


var HomePage = React.createClass({
  render() {
    return (
      <section>
        <BreadCrumb />
        <div className="page-header">
          <h1>Explorateur de la législation</h1>
        </div>
        <div className="col-lg-4">
          <div className="thumbnail">
            <div className="caption">
              <h4>Variables et formules socio-fiscales</h4>
              <p>
                Visualiser et rechercher les variables d'entrée, les variables calculées et leurs dépendences.
              </p>
              <p>
                <Link className="btn btn-primary" to="variables">Voir »</Link>
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
                <Link className="btn btn-primary" to="parameters">Voir »</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
});


export default HomePage;
