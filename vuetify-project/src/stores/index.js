// Utilities
import { createPinia } from 'pinia'
// 下面為匿名匯入，所以不用加大括號，名稱可以自己取
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 0709/ 03:07:00
// 設定好 'piniaPluginPersistedstate' 以後，要在 store/user.js 設定保存的資料設定
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
