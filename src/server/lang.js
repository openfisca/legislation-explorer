import path from "path"
import {readdir} from "fs"

import {addLocaleData} from "react-intl"
import fr from "react-intl/locale-data/fr"
import en from "react-intl/locale-data/en"

const DEFAULT_LANGUAGE = 'fr'

export function loadTranslations(langDir) {
  addLocaleData(...fr)
  addLocaleData(...en)

  var messages = {}
  readdir(langDir, (err, files) => {
    if(err) {
      console.log("Unable to load translation files.", err)
    }

    files.forEach(file => {
      messages[path.basename(file, '.json')] = require(path.resolve(langDir, file))
    })
  })

  return messages
}

export function getLocale(acceptLanguage, messages){
  var locale = acceptLanguage ? acceptLanguage.substring(0, 2) : DEFAULT_LANGUAGE //ex: en-US;q=0.4,fr-FR;q=0.2 > en

  if(! messages[locale]) {
    locale = DEFAULT_LANGUAGE
  }
  return locale
}

export function getLocaleMessages(locale, messages){
  return messages[locale]
}
