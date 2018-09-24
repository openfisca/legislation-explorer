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
    console.log(entityId)
    console.log(entity)

    return (
      <DocumentTitle title={entityId + ' — ' + this.props.intl.formatMessage({ id: 'appName' })}>
        <section>
          <h1><code>{ entityId }</code></h1>
          { entity.description
            ? <p className="description">{entity.description}</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          { entity.roles
            ? <p className="roles">{entity.roles}</p>
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
