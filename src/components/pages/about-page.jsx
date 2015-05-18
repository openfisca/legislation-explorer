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


import React from "react/addons";
import url from "url";

import BreadCrumb from "../breadcrumb";
import config from "../../config";


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
          <a href={config.gitWebpageUrl} rel="external" target="_blank">
            Code source de legislation-explorer
          </a>
          {" "}
          sur GitLab, merci à <a href="http://framasoft.org" rel="external" target="_blank">Framasoft</a> !
        </p>
        <p>
          <a href={url.resolve(config.websiteUrl, "/a-propos")}>
            À propos du projet OpenFisca
          </a>
        </p>
      </section>
    );
  },
});


export default AboutPage;
