import config from '../config'

import acceptLanguage from 'accept-language'
import {fromPairs} from 'ramda'

import path from 'path'
import {readdirSync} from 'fs'


const DEFAULT_LANGUAGE = 'en'


export function loadTranslations(langDir) {
  return fromPairs(
    readdirSync(langDir).map(file => {
      const lang = path.basename(file, '.json')
      const messages = Object.assign(
        {},
        require(path.resolve(langDir, file)),
        config.ui[lang]  // load all config-provided locale strings
      )
      return [lang, messages]
    })
  )
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
