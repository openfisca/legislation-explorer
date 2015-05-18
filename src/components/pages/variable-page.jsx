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
import DocumentTitle from "react-document-title";
import React from "react/addons";

import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";


var VariablePage = React.createClass({
  propTypes: {
    variable: AppPropTypes.variable.isRequired,
  },
  render() {
    var {formula, label, name} = this.props.variable;
    return (
      <DocumentTitle title={`${label} (${name}) - Explorateur de la légisation`}>
        <div>
          {this.renderBreadcrumb()}
          <div className="page-header">
            <h1>{name}</h1>
          </div>
          <p>
            {label}
            {label === name && " (à compléter)"}
          </p>
          {this.renderVariableHeader()}
          {formula && this.renderFormula()}
        </div>
      </DocumentTitle>
    );
  },
  renderBreadcrumb() {
    var {name} = this.props.variable;
    return (
      <BreadCrumb>
        <li>
          <Link to="variables">Variables</Link>
        </li>
        <li className="active">{name}</li>
      </BreadCrumb>
    );
  },
  renderFormula() {
    var {formula} = this.props.variable;
    var githubUrl = "https://github.com/openfisca/openfisca-france/tree/master/" +
      formula.module.split(".").join("/") + ".py#L" + formula.line_number + "-" +
      (formula.line_number + formula.source.trim().split("\n").length - 1);
    return (
      <div>
        <pre style={{overflowX: "auto"}}>
          <code className="python" style={{
            overflowWrap: "normal",
            whiteSpace: "pre",
          }}>{formula.source}</code>
        </pre>
        <a href={githubUrl} rel="external" target="_blank">Voir dans GitHub</a>
      </div>
    );
  },
  renderVariableHeader() {
    var {variable} = this.props;
    var entityLabelByNamePlural = {
      familles: "Famille",
      "foyers_fiscaux": "Foyer fiscal",
      individus: "Individu",
      menages: "Ménage",
    };
    return (
      <dl className="dl-horizontal">
        <dt>Type</dt>
        <dd>
          <code>{variable["@type"]}</code>
          {variable.val_type && ` (${variable.val_type})`}
        </dd>
        <dt>Valeur par défaut</dt>
        <dd><samp>{variable.default}</samp></dd>
        <dt>Entité</dt>
        <dd>{entityLabelByNamePlural[variable.entity]}</dd>
        {
          variable.cerfa_field && [
            <dt key="cerfa-dt">Cellules CERFA</dt>,
            <dd key="cerfa-dd">
              {
                typeof variable.cerfa_field === "string" ?
                  variable.cerfa_field :
                  Object.values(variable.cerfa_field).join(", ")
              }
            </dd>,
          ]
        }
        {
          variable.start && [
            <dt key="start-dt">Démarre le</dt>,
            <dd key="start-dd">{variable.start}</dd>,
          ]
        }
      </dl>
    );
  },
});


export default VariablePage;
