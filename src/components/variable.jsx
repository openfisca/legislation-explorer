import DocumentTitle from "react-document-title"
import { FormattedDate } from "react-intl"
import { Link } from "react-router"
import React, { PropTypes } from "react"
import { substract, sort, sortBy, prop, keys } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import GitHubLink from "./github-link"
import List from "./list"


const Variable = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variable: AppPropTypes.variable.isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },
  getTodayInstant() {
    return new Date().toJSON().slice(0, 10)
  },
  render() {
    const {variable} = this.props
    return (
      <DocumentTitle title={`${variable.id} - Explorateur de la législation`}>
        <div>
          <header className="page-header">
            <h1>{variable.id}</h1>
            <p>{variable.description}</p>
          </header>
          {this.renderVariableMetadata(variable)}
          <div>
            <ExternalLink href={variable.source}>
              Voir le code source de cette variable
            </ExternalLink>
          </div>
          {variable.formulas && this.renderFormulas(variable.formulas)}
          <div>
            <ExternalLink href={`${config.apiBaseUrl}/variable/${variable.id}`}>
              Voir la donnée brute au format JSON
            </ExternalLink>
          </div>
        </div>
      </DocumentTitle>
    )
  },
  renderVariableMetadata(variable) {
    const entityMessage = {
      famille: "une famille",
      foyer_fiscal: "un foyer fiscal",
      individu: "un individu",
      menage: "un ménage",
    }
    const definitionPeriodMessage = {
      YEAR: "de l'année",
      MONTH: "du mois",
      ETERNITY: "de l'éternité (cette variable ne peut pas évoluer avec le temps",
    }
    return (
      <div>
        <dl>
          <dt>Cette variable est définie pour</dt>
          <dd>{entityMessage[variable.entity]}.</dd>
          <dt>Elle se calcule à l'échelle</dt>
          <dd>{definitionPeriodMessage[variable.definitionPeriod]}</dd>
          <dt>Elle est de type</dt>
          <dd>{variable.valueType}</dd>
          <dt>Sa valeur par défault est</dt>
          <dd>{String(variable.defaultValue)}</dd>
        {
          variable.references && (
            <span>
              <dt>Références :</dt>
              <dd><ul>
                {
                  variable.references.map((reference, idx) =>
                    <li key={idx}>
                      <ExternalLink href={reference}>
                        {reference}
                      </ExternalLink>
                    </li>
                  )
                }
              </ul></dd>
            </span>
          )
        }
        </dl>
      </div>
    )
  },
  renderFormulas(formulas) {
    const startDates = keys(formulas).sort().reverse()
    const severalFormulas = (startDates.length > 2) || (startDates.length == 2) && formulas[startDates[0]]
    return (
      <div>
        <h2>Formule{severalFormulas && 's'} de calcul</h2>
        {startDates.map(
          (date, dateIndex) => {
            const startDate = (date != '0001-01-01') && date
            const stopDate = startDates[dateIndex - 1]
            return formulas[date] && (
              <div key={date}>
                {startDate && (! stopDate) && <h3>À partir du {startDate}&nbsp;:</h3>}
                {stopDate && (! startDate) && <h3>Jusqu'au {stopDate}&nbsp;:</h3>}
                {startDate && stopDate && <h3>Du {startDate} au {stopDate}&nbsp;:</h3>}
                <pre>{formulas[date].content}</pre>
              </div>
            )
          })
        }
      </div>
    )
  },
})


export default Variable
