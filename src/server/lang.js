import config from '../config'

import path from 'path'
import {readdir} from 'fs'
import acceptLanguage from 'accept-language'


const DEFAULT_LANGUAGE = 'en'


export function loadTranslations(langDir) {
  var messages = {}
  readdir(langDir, (err, files) => {
    if (err) {
      throw new Error("Unable to load translation files from '" + langDir + "' directory. See following error for more information: " + err)
    }

    files.forEach(file => {
      messages[path.basename(file, '.json')] = require(path.resolve(langDir, file))
    })

      // load all config-provided locale strings
    Object.keys(messages).forEach(lang => {
      Object.assign(messages[lang], config.ui[lang])
    })
  })

  return messages
}


export function getLocale(clientAcceptLanguage, messages) {
  try {
    acceptLanguage.languages(Object.keys(messages))
  } catch (error) {
    throw new Error('Unable to get known languages. See following error for more information: ' + error)
  }

  var locale = clientAcceptLanguage ? acceptLanguage.get(clientAcceptLanguage) : DEFAULT_LANGUAGE
  if (! messages[locale]) {
    locale = DEFAULT_LANGUAGE
  }
  return locale
}

export function getLocaleMessages(locale, messages) {
  return messages[locale]
}
