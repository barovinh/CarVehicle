import { createI18n } from 'vue-i18n'
import vi from './vi'

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'vi',
    fallbackLocale: 'vi',
    messages: {
        vi
    }
})

export default i18n
