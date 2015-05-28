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


import {FormattedDate, FormattedMessage} from "react-intl";
import {Link} from "react-router";
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";
import Highlight from "../highlight";


var VariablePage = React.createClass({
  propTypes: {
    gitCommitSha: PropTypes.string.isRequired,
    variable: AppPropTypes.variable.isRequired,
  },
  githubSourceFileUrl(formula) {
    const moduleAndFileUrlPath = formula.module.split(".").join("/");
    const lastLine = formula.line_number + formula.source.trim().split("\n").length - 1;
    return `https://github.com/openfisca/openfisca-france/blob/${this.props.gitCommitSha}/\
${moduleAndFileUrlPath}.py#L${formula.line_number}-${lastLine}`;
  },
  render() {
    var {formula, label, name} = this.props.variable;
    return (
      <div>
        <p>
          {label}
          {label === name && " (à compléter)"}
        </p>
        {this.renderVariableHeader()}
        {
          formula && (
            formula["@type"] === "DatedFormula" ?
              this.renderDatedFormula(formula) :
              this.renderFormula(formula)
            )
        }
      </div>
    );
  },
  renderDatedFormula(formula) {
    return formula.dated_formulas.map((datedFormula, idx) => (
      <div key={idx}>
        <h4>{this.renderDatedFormulaHeading(datedFormula)}</h4>
        <Highlight language="python">{datedFormula.formula.source}</Highlight>
        <a href={this.githubSourceFileUrl(datedFormula.formula)} rel="external" target="_blank">Voir sur GitHub</a>
      </div>
    ));
  },
  renderDatedFormulaHeading(formula) {
    var heading;
    if (formula.start_instant && formula.stop_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul du {start} au {stop}"
          start={<FormattedDate format="short" value={formula.start_instant} />}
          stop={<FormattedDate format="short" value={formula.stop_instant} />}
        />
      );
    } else if (formula.start_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul depuis le {start}"
          start={<FormattedDate format="short" value={formula.start_instant} />}
        />
      );
    } else if (formula.stop_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul jusqu'au {stop}"
          stop={<FormattedDate format="short" value={formula.stop_instant} />}
        />
      );
    }
    return heading;
  },
  renderFormula(formula) {
    return (
      <div>
        <h4>Formule de calcul</h4>
        <Highlight language="python">{formula.source}</Highlight>
        <a href={this.githubSourceFileUrl(formula)} rel="external" target="_blank">Voir sur GitHub</a>
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
        {
          variable.input_variables && variable.input_variables.length ? [
            <dt key="input-variables-dt">Dépend de</dt>,
            <dd key="input-variables-dd">
              <ul className="list-inline">
                {
                  variable.input_variables.map((name, idx) => (
                    <li key={idx}>
                      <Link params={{name}} to="variable">{name}</Link>
                    </li>
                  ))
                }
              </ul>
            </dd>,
          ] : null
        }
      </dl>
    );
  },
});


export default VariablePage;
