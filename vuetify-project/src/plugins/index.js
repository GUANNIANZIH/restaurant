/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
// 0709/ 03:17:35
// 在 plugins/index.js，所以要在 app.use(vuetify) 之後去引用這個套件
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
// 引入套件 'vuetify-use-dialog'
import VuetifyUseDialog from 'vuetify-use-dialog'
// 引入套件 '@boindil/vue-file-agent-next'，用來處理前端圖片檔案上傳。 
import VueFileAgentNext from '@boindil/vue-file-agent-next'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'
// 引入 VueSocketIO 套件，用來建立 Vue3 與 socket.io 連線
import VueSocketIO from '@hlf01/vue3-socket.io'
// 引入 socket.io-client 套件，用來建立 socket.io 連線
import { io } from 'socket.io-client'

export function registerPlugins (app) {
  // socketConnection 設置： 為了更清楚地管理 Socket.IO 的連接
  // 將 io('http://localhost:3000') 提取到變數 socketConnection 中。
  const socketConnection = io(import.meta.env.VITE_API)// 使用伺服器地址

  app
  // 在 app.use(vuetify) 之後去引用這個套件
    .use(vuetify)
    // 0709/ 03:23:55
    // 設定元件使用的預設值
    .use(VuetifyUseDialog, {
      snackbar: {
        showCloseButton: false,
      // 0709/ 03:22:00
      // 設定傳入的 props
      snackbarProps: {
        timeout: 2000,
        color: '#3C5D44'
      }
      }
    })
    // 順序問題： 確保 app.use() 的順序是正確的，
    // 尤其是在涉及到像 Vuetify 和 VueSocketIO 這樣的插件時。
    // 更靈活地處理 WebSocket 連線和即時通訊需求。
    .use(VueFileAgentNext)
    .use(router)
    .use(pinia)
    // VueSocketIO 插件初始化： 使用 new VueSocketIO() 來創建 VueSocketIO 實例，並傳遞需要的配置參數。
    .use(new VueSocketIO({
      debug: true, // 如果需要可以將 debug 設定為 false
      connection: socketConnection,
    }))
}

// export function registerPlugins (app) {
//   app
//   // 在 app.use(vuetify) 之後去引用這個套件
//     .use(vuetify)
//     // 0709/ 03:23:55
//     // 設定元件使用的預設值
//     .use(VuetifyUseDialog, {
//       snackbar: {
//         showCloseButton: false,
//       // 0709/ 03:22:00
//       // 設定傳入的 props
//       snackbarProps: {
//         timeout: 2000,
//         color: '#3C5D44'
//       }
//       }
//     })
//     .use(VueFileAgentNext)
//     .use(router)
//     .use(pinia)
//     .use(new VueSocketIO({
//       debug: true, // 如果需要可以將 debug 設定為 false
//       connection: socketConnection,
//     }))
// }
