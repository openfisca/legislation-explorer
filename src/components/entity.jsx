import DocumentTitle from 'react-document-title'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'

import { entityShape } from '../openfisca-proptypes'


class Entity extends React.Component {
  static propTypes = {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    entity: entityShape.isRequired,
  };

  render() {
    const { entity } = this.props

    return (
      <DocumentTitle title={entity.id + ' — ' + this.props.intl.formatMessage({ id: 'appName' })}>
        <section>
          <h1><code dangerouslySetInnerHTML={{__html: multilineId}}></code></h1>
          { entitiy.description
            ? <p className="description">{entitiy.description}</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          { entitiy.roles
            ? <p className="roles">{entitiy.roles}</p>
            : <em><FormattedMessage id="noRoles"/></em>
          }
          { entitiy.description
            ? <p className="description">{entitiy.description}</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          <hr/>
          <a rel="external" target="_blank" href={`${config.apiBaseUrl}/entities/${entitiy.id}`}>
            <FormattedMessage id="rawJSONData"/>
          </a>
        </section>
      </DocumentTitle>
    )
  }
}
