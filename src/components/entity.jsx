import DocumentTitle from 'react-document-title'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'

import config from '../config'
import { entityShape } from '../openfisca-proptypes'


class Entity extends React.Component {
  static propTypes = {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    entityId: PropTypes.string.isRequired,
    entity: entityShape.isRequired,
  };

  
  render() {
    const { entityId, entity } = this.props

    return (
      <DocumentTitle title={entityId + ' — ' + this.props.intl.formatMessage({ id: 'appName' })}>
        <section>
          <h1><code>{ entityId }</code></h1>
          {
            entity.plural
            ? <span className="message">
                <FormattedMessage id="plural"/>&nbsp;{ entity.plural }
              </span>
            : <em><FormattedMessage id="noPlural"/></em>
          }
          { entity.description
            ? <p className="description">{ entity.description }</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          {
            entity.documentation &&
            <div>
              <FormattedMessage id="documentation"/>
              <span className="message"> { entity.documentation }</span>
            </div>
          }
          {
            entity.roles  
            ? (
              <div>
                <FormattedMessage id="entityRoles"/>
                <ul>
                {
                  Object.keys(entity.roles).map((roleId, index) => ( 
                  <li key={ roleId }>
                    { roleId }
                    { 
                      entity.roles[roleId].plural
                      ? <span className="message">{ entity.roles[roleId].plural }</span>
                      : <em><FormattedMessage id="noPlural"/></em>
                    }
                    { 
                      entity.roles[roleId].description
                      ? <span className="message">{ entity.roles[roleId].description }</span>
                      : <em><FormattedMessage id="noDescription"/></em>
                    }
                    { 
                      entity.roles[roleId].max &&
                      <div>
                        <span className="message"><FormattedMessage id="roleMaxPersons"/>&nbsp;{ entity.roles[roleId].max }</span>
                      </div>
                    }
                  </li> 
                  ))
                }
                </ul>
              </div>)
            : <em><FormattedMessage id="noRole"/></em>
          }
          <hr/>
          <a rel="external" target="_blank" href={`${config.apiBaseUrl}/entities`}>
            <FormattedMessage id="rawJSONData"/>
          </a>
        </section>
      </DocumentTitle>
    )
  }
}

export default injectIntl(Entity)
