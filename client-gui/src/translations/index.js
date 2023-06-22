import commonEn from './en/common.json'
import commonVi from './vi/common.json'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escape: false
  },
  resources: {
    en: {
      common: commonEn
    },
    vi: {
      common: commonVi
    }
  }
})

export default i18n
