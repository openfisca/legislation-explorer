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
            ? <span>
                <h5><code>{ entity.plural }</code></h5>
              </span>
            : <em><FormattedMessage id="noPlural"/></em>
          }
          { entity.description
            ? <p className="description">{ entity.description }</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          { this.renderRoles(entity.roles) }
          {
            entity.documentation &&
            <div>
              <span className="message"><FormattedMessage id="documentation"/></span>
              <span className="message">{ entity.documentation }</span>
            </div>
          }
          <hr/>
          <a rel="external" target="_blank" href={`${config.apiBaseUrl}/entities`}>
            <FormattedMessage id="rawJSONData"/>
          </a>
        </section>
      </DocumentTitle>
    )
  }

  renderEntityRole = (roleId, role) => {
    return (
      <tr key={ roleId }>
        <td>{ roleId }</td>
        <td>
          { 
            role.plural
            ? <span className="message">{ role.plural }</span>
            : <em><FormattedMessage id="noPlural"/></em>
          }
        </td>
        <td>
          { 
            role.description
            ? <span className="message">{ role.description }</span>
            : <em><FormattedMessage id="noDescription"/></em>
          }
        </td>
        <td>
          { 
            role.max 
            ? <span className="message">{ role.max }</span> 
            : <em><FormattedMessage id="noRoleMaxPersons"/></em>
          }
        </td>
      </tr>
    )
  }

  renderRoles = (roles) => {
    return (
      <div>
        {
          roles  
          ? <div>
              <span className="message">
                <pre><FormattedMessage
                  id="entityRolesParagraph"
                  values={{
                    entityLink:
                      <a href="https://openfisca.org/doc/person,_entities,_role.html" rel="noopener" target="_blank">
                        <FormattedMessage id="entityText"/>
                      </a>
                  }}
                /></pre>
              </span>
              <table className="table table-bordered table-hover table-striped">
                <thead>
                  <tr>
                    <td><FormattedMessage id="entityRoles"/></td>
                    <td><FormattedMessage id="rolePlural"/></td>
                    <td><FormattedMessage id="roleDescription"/></td>
                    <td><FormattedMessage id="roleMaxPersons"/></td>
                  </tr>
                </thead>
                <tbody>
                  { 
                    Object.keys(roles).map((roleId, index) => (
                        this.renderEntityRole(roleId, roles[roleId])
                    ))
                  }
                </tbody>
              </table>
            </div>
          : <em><FormattedMessage id="noRole"/></em>
        }
      </div>
    )
  }
}

export default injectIntl(Entity)
