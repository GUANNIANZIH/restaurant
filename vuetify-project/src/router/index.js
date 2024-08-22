/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
// vue-router-auto、vue-router/auto-routers 來自動生成路由，可以簡化路由配置

// 0709/ 03:38:00 增加重新導向功能 START_LOCATION
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'
// 布局配置: 使用'virtual:generated-layouts'設置布局
import { setupLayouts } from 'virtual:generated-layouts'
// vue-router-auto、vue-router/auto-routers 來自動生成路由，可以簡化路由配置
import { routes } from 'vue-router/auto-routes'
// 把使用者的資訊存到 user store，並引入
import { useUserStore } from '@/stores/user.js'

// 創建路由器: 使用 createWebHashHistory
// 新版和舊版都使用 createWebHashHistory，但新版使用 import.meta.env.BASE_URL 來獲取基礎路徑。
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 0709/ 03:34:15
// 當使用者 login 之後，Pinia 抓到的資料只有 user 的 token，
// 但沒有取到 account, role, cart 等等其他資訊，
// 因為我們只有保留 token，在每一次進入網頁時，都要取得使用者的 token，
// 再使用 token 去取得使用者的其他資訊，
// 像是 account, cart 等等其他資訊來使用。
// 所以要在前端的 router/index.js 增加處理的東西。

// 0709/ 03:39:00
// 0717/ 00:05:35
router.beforeEach( async (to, from, next) => {
  const user = useUserStore() // 這邊放在 if 外面的原因是因為後面還會用到 user。
  if (from === START_LOCATION) {
    console.log('First navigation')
    // 0709/ 03:53:50 要來在 START_LOCATION 地方去取得 "目前的使用者資訊"
    await user.profile() // 使用 await 一定要在 async function 裡面。
  }
  // 0717/ 00:06:50
  // 如果使用者已經登入，且要去的路徑是 '/member/login' 或 '/member/register'
  // .includes(to.path) 是用來判斷 to.path 是否包含在陣列裡面
  if (user.isLogin && ['/member'].includes(to.path)){
    // 重新導向去首頁
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    next('/member')
  } else if (to.meta.admin && !user.isAdmin) {
    next('/')
  } else{
    next() 
    // 這裡一定要去 next()，不然會網頁會卡住，沒辦法進到下一個頁面。
    // next() 可以做重新導向，裡面可以放網址、路由，或是擋東西。這裡代表該去哪就去哪。
  }
})

// vite-plugin-pages 生成的路由配置是一個對象數組，每個對象都包含路由的 path、component 和 meta 等信息。
// 進到每一頁路由後，將 document.title 設置為當前路由的 meta.title
router.afterEach((to, from) => {
  document.title = to.meta.title
})

// 新增錯誤處理，解決 Vite 的動態導入模塊錯誤。
// 新版加入了動態導入模塊錯誤處理邏輯，確保在遇到錯誤時能重新加載頁面。舊版通常沒有這樣的錯誤處理邏輯。
// Workaround for https://github.com/vitejs/vite/issues/11804
// 設置處理器來捕捉路由過程中的錯誤，接收兩個參數 err(錯誤對象), to(目標路由)
router.onError((err, to) => {
  // 檢查錯誤訊息是否包含 'Failed to fetch dynamically imported module'，這是一個特定的錯誤信息，表示動態導入模塊失敗。
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    // 檢查本地存儲中是否存在 vuetify:dynamic-reload 標記。如果不存在，這意味著這是第一次遇到這個錯誤。
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      // 記錄一條日誌信息，表示正在重新加載頁面以修復動態導入錯誤。
      // 將 vuetify:dynamic-reload 標記設置為 true，以避免無限重載循環。
      // 使用 location.assign 重新加載當前頁面。
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      // 如果重新加載頁面後錯誤依然存在，記錄錯誤信息，表示重新加載頁面並未修復錯誤。
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    // 如果錯誤信息不包含特定的動態導入模塊錯誤，則直接記錄錯誤信息。
    console.error(err)
  }
})

  // 準備就緒後移除重載標記
  // router.isReady：
  // 這個方法返回一個 Promise，當路由器準備就緒時，這個 Promise 會被解決。這意味著所有的異步路由和導航守衛都已經完成。
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})
// 這段代碼的主要目的在於確保在遇到動態導入模塊錯誤時能自動處理並嘗試修復，
// 從而提供更好的用戶體驗。通過記錄和管理本地存儲標記，可以避免無限重載循環，
// 並在必要時提示開發人員錯誤的具體信息。

export default router
