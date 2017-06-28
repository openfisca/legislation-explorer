import DocumentTitle from "react-document-title"
import { FormattedDate } from "react-intl"
import React, { PropTypes } from "react"
import {routerShape, locationShape, Link} from "react-router"
import { keys } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import getDayBefore from "../periods"


const Variable = React.createClass({
  contextTypes: {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
  },
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
  navigateProgramatically(e) {
    const searchQuery = ""
    this.setState({variable: searchQuery})
    this.context.setSearchQuery(searchQuery)
    this.context.router.push({
      query: {q: searchQuery},
    })
  },
  componentDidMount() {
    this._isMounted = true
    const {router} = this.context
    this.unregisterRouterListen = router.listen(this.locationHasChanged)
  },
//  componentWillUnmount() {
//    console.log("Variable > componentWillUnmount")
//    this._isMounted = false
//    this.unregisterRouterListen()
//  },
  locationHasChanged(location) {
    const {router} = this.context
    const oldLocation = this.props.location
    // Check that the new location stays on the Home page, to avoid overwriting searchQuery in App state.
    if (this._isMounted && oldLocation && router.isActive(oldLocation)) {
      const searchQuery = location.query.q || ""
      this.context.setSearchQuery(searchQuery)
      this.setState({variable: variable.data, location: location, waitingForResponse: false})
    }
  },
  render() {
    const {variable} = this.props
    return (
      <DocumentTitle title={`${variable.id} - Explorateur de la législation`}>
        <div>
          <header className="page-header">
            <h1><code>{variable.id}</code></h1>
            <p>{variable.description}</p>
          </header>
          {this.renderVariableMetadata(variable)}
          <div>
            <ExternalLink href={variable.source}>
              Code source de cette variable
            </ExternalLink>
          </div>
          {variable.formulas && this.renderFormulas(variable.formulas)}
          <div>
            <ExternalLink href={`${config.apiBaseUrl}/variable/${variable.id}`}>
              Donnée brute au format JSON
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
      ETERNITY: "de l'éternité (cette variable ne peut pas évoluer avec le temps)",
    }
    return (
      <div>
        <dl>
          <dt>Cette variable est définie pour</dt>
          <dd>{entityMessage[variable.entity]}.</dd>
          <dt>Elle se calcule à l'échelle</dt>
          <dd>{definitionPeriodMessage[variable.definitionPeriod]}.</dd>
          <dt>Elle est de type</dt>
          <dd>{variable.valueType}.</dd>
          <dt>Sa valeur par défault est</dt>
          <dd>{String(variable.defaultValue)}.</dd>
          { variable.references && <dt>Références&nbsp;:</dt> }
          { variable.references && (
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
          )}
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
            const stopDate = startDates[dateIndex - 1] && getDayBefore(startDates[dateIndex - 1])
            return formulas[date] && (
              <div key={date}>
                {startDate && (! stopDate) &&
                  <h3>À partir du <FormattedDate value={startDate} />&nbsp;:</h3>
                }
                {stopDate && (! startDate) &&
                  <h3>Jusqu'au <FormattedDate value={stopDate} />&nbsp;:</h3>
                }
                {startDate && stopDate &&
                  <h3>Du <FormattedDate value={startDate} /> au <FormattedDate value={stopDate} />&nbsp;:</h3>
                }
                <Link key="toto" to="toto" onClick={this.navigateProgramatically}>toto</Link>
                <pre><code>{this.renderLinkedFormulaVariables(formulas[date].content)}</code></pre>
              </div>
            )
          })
        }
      </div>
    )
  },
  link(substring, quote) {
    if (!substring.includes(" ") && this.props.variables[substring]) {
      return <Link key={substring} to={substring} onClick={this.navigateProgramatically}>{quote + substring + quote}</Link>
    } 
    return quote + substring + quote
  },
  // Change every OpenFisca variable in the formula by a link to the variable page:
  renderLinkedFormulaVariables(formula) {
    return formula.split("'").map((substring, index) => {
      return (index % 2 != 0) ? 
        this.link(substring, "'") : substring.split('"').map((substring, index) => {
          return (index % 2 != 0) ? this.link(substring, '"') : substring
        })
    })
  },
})


export default Variable
