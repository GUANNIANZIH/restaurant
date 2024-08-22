/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
// 這裡是用來引入 Vuetify 的樣式，這裡的樣式是用來設定 Vuetify 的主題。

import { createVuetify } from 'vuetify'
// 0719 /00:13:15
// 可以在這裡去引入自己的語言包進來使用，也可以自己寫一個自己的翻譯檔。
import { zhHant } from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// createVuetify 是 Vuetify 3 中用來創建 Vuetify 實例的配置方法。
// 這裡面的一個重要部分是主題（theme）的設定，
// 可以在這裡定義應用的主題顏色，包括 primary、secondary 等顏色。
export default createVuetify({
  theme: {
    themes: {
      light: {
        primary: '#2C3E31',
        secondary: '#3C5D44',
        accent: '#D78A24',
        error: '#D66425',
        light: '#FDEACE',
      }
    },
    options: { customProperties: true },
  },
  // 0719/ 00:12:10
  // 語言設定 Vuetify i18n ，要注意跟 Vue.js 的語言帶碼不一定會一樣。
  // 如果要寫語言切換，要自己寫切換的東西設定。
  // 語言包設定再加上一個 locale 的選項，設定現在的語言；fallback 代替語言包；messages 設定的語言包內容。
  // zhHant 是繁體中文的語言包。
  locale: {
    locale: 'zhHant',
    messages: {
      zhHant
    }
  }
})

