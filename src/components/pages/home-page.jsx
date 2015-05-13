/*
OpenFisca -- A versatile microsimulation software
By: OpenFisca Team <contact@openfisca.fr>

Copyright (C) 2011, 2012, 2013, 2014, 2015 OpenFisca Team
https://github.com/openfisca

This file is part of OpenFisca.

OpenFisca is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

OpenFisca is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import {Link} from "react-router";
import React from "react/addons";


var HomePage = React.createClass({
  render() {
    return (
      <section>
        <div className="page-header">
          <h1>Explorateur de la législation</h1>
        </div>
        <div className="col-lg-4">
          <div className="thumbnail">
            <div className="caption">
              <h4>Variables et formules socio-fiscales</h4>
              <p>
                Pour visualiser et rechercher les variables d'entrée, les variables calculées (avec formule)
                et leurs dépendences.
              </p>
              <p>
                <Link className="btn btn-primary" to="variables">Voir »</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
});


export default HomePage;
