import path from "path"
import {readdir} from "fs"

import {addLocaleData} from "react-intl"

const DEFAULT_LANGUAGE = 'fr'

export function loadTranslations(langDir) {
  var messages = {}
  readdir(langDir, (err, files) => {
    if(err) {
      console.log("Unable to load translation files.", err)
    }

    var possibleLocale
    files.forEach(file => {
      possibleLocale = path.basename(file, '.json')
      addLocaleData(require(`react-intl/locale-data/${possibleLocale}`))
      messages[possibleLocale] = require(path.resolve(langDir, file))
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
