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
              ? <div>
                <FormattedMessage id="plural"/>
                <code>{ entity.plural }</code>
              </div>
              : <em><FormattedMessage id="noPlural"/></em>
          }
          { entity.description
            ? <p className="description">{ entity.description }</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          {
            entity.roles
              ? <FormattedMessage
                id="entityRolesParagraph"
                values={{
                  entityLink:
                      <a href="http://openfisca.org/doc/person,_entities,_role.html#group-entities" rel="noopener" target="_blank">
                        <FormattedMessage id="entityGroupType"/>
                      </a>
                }}
              />
              : <FormattedMessage
                id="entitySingleIntroduction"
                values={{
                  entityId: entityId,
                  entityLink:
                      <a href="http://openfisca.org/doc/person,_entities,_role.html#person" rel="noopener" target="_blank">
                        <FormattedMessage id="entitySingleType"/>
                      </a>
                }}
              />
          }
          { this.renderRoles(entity.roles) }
          {
            entity.documentation &&
            <div>
              <h4 className="message"><FormattedMessage id="documentation"/></h4>
              <p className="documentation">{ entity.documentation }</p>
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
        <td><pre>{ roleId }</pre></td>
        <td>
          {
            role.plural
              ? <pre>{ role.plural }</pre>
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
          roles && <table className="table table-bordered table-hover table-striped">
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
                Object.keys(roles).map((roleId) => (
                  this.renderEntityRole(roleId, roles[roleId])
                ))
              }
            </tbody>
          </table>
        }
      </div>
    )
  }
}

export default injectIntl(Entity)
