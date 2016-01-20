import React from "react"
import url from "url"

import BreadCrumb from "../breadcrumb"
import config from "../../config"


var AboutPage = React.createClass({
  render() {
    return (
      <section>
        <BreadCrumb>
          <li className="active">À propos</li>
        </BreadCrumb>
        <div className="page-header">
          <h1>À propos</h1>
        </div>
        <p>
          Le code source de legislation-explorer est
          <a href={config.gitWebpageUrl} rel="external" target="_blank">
            sur GitHub
          </a>.
        </p>
        <p>
          <a href={url.resolve(config.websiteUrl, "/a-propos")}>
            À propos du projet OpenFisca
          </a>
        </p>
      </section>
    )
  },
})


export default AboutPage
