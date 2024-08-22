// 透過 axios 發送 API 請求
// axios 是一個流行的 HTTP 客戶端，用來在前端和後端之間進行 API 請求。
// 允許你發送 GET、POST、PUT、DELETE 等 HTTP 請求，並返回一個 Promise，讓你能夠處理請求的結果或錯誤。
// 這裡可能要看 0703 的筆記

// 目前這個檔案主要分成兩個部分，一個是 api，一個是 apiAuth:
import axios from "axios";
import { useUserStore } from "@/stores/user";

// 0709/ 03:49:50
// api : 單純的 api，不會自動加上 jwt(token)
const api = axios.create({
    // 連接 env 環境變數
    baseURL: import.meta.env.VITE_API,
})

// 0709/ 03:49:50
// apiAuth : 會自動把使用者的認證資訊加在上面。
// 所以所有需要登入才可以執行的請求都要使用 apiAuth 才會比較方便。

// 0709/ 03:42:00
// 所以會去 composables/axios.js 做 "建立 api" 的動作一樣，
// 再去建立一個新的 axios 叫做 apiAuth，
// apiAuth 可以設定為: 如果是要發 "登入 api 的請求" 可以使用這個來做。
// 要先 import { useUserStore } from '@/stores/user' 進
const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_API,
})

// 0709/ 03:43:10、03:44:20
// 使用一個叫做 "攔截器" 的功能，分成兩個部分，
// 一個是 "請求攔截器(送出前加料)"、一個是 "回應攔截器(收到回應的時候， 再回到呼叫的 function 中間加料)"。
// 要注意 config.headers.Authorization = 'Bearer ' + user.token ('Bearer ' 有空白)

// 攔截器的流程:
// 1. axios.get / axios.post ...
// 2. interceptors.request
// 3. 送出
// 4. interceptors.response
// 5. .then() .catch()

// 0709/ 03:46:24、03:48:00
// 這裡的作法是寫一個 interceptors 攔截器，
// 在送出請求的時候，去抓目前使用的的 stores/user.js ，
// 然後把 token 加在 headers 裡面一起送出去。
// config 代表這次請求的設定，請求目標網址、有甚麼資料、方式(GET, POST, PATCH...)、Body 等等的設定，

// 0709/ 03:48:00 (interceptors.request 請求攔截器)
// 如果使用 apiAuth 送出請求時，會先經過這個攔截器，自動加上 jwt(token) 的動作。
// 就不需要在原本的 stores/user.js 裡面手動寫加上 jwt(token) 的動作。

apiAuth.interceptors.request.use(config => {
    const user = useUserStore() // 讀取當下的 stores/user.js，一定要在裡面，
    // 如果在外面 user.js 會保持在剛進網頁的狀態，順序是: 進網頁 -> 進入 user.js -> 進入 axios.js。
    // 當要發起球時才去抓 user.token
    config.headers.Authorization = 'Bearer ' + user.token
    return config // 把修改後的設定給 return 出去，就會以修改後的設定去發請求。
// 這樣寫才不用每次都要手動寫加上 jwt(token) 的動作。
})

// 0709/ 03:48:20
// 當 "發生 jwt 過期" 的時候，就會自動發出 "舊換新" 的請求，再用新的東西，重新送一次 axios。

// 0716/ 00:03:10 "回應攔截器"(interceptors.response 回應攔截器)
// 只有一個參數 res，代表回來的請求。
// 請求可能會成功、失敗，所以要加上第二個參數。如果失敗的話，後面要加第二個參數: error

// 0716/ 00:18:00 ~ 00: 22: 00
    // 簡單流程講解:
    // 1. 可能先使用 apiAuth.get(/user/profile) - 在 stores/usr.js/profile() 用來取得使用者資訊。
    // 2. 出去攔截器 apiAuth.interceptors.request 會自動加上 jwt(token)。
    // 3. 傳送出去。
    // 4. 回來的攔截器 apiAuth.interceptors.response 
    //    會分成 res 成功(回傳原本的資料), error 失敗(判斷失敗的種類: 如果失敗 && 登入過期，就會自動 "舊換新")
    // 5. 舊換新成功，修改 apiAuth.get(/user/profile) 重新送出，取得使用者資料，
    // 6. 就換新失敗，回傳 apiAuth.get(/user/profile) 的錯誤。

apiAuth.interceptors.response.use(res => {
    // 回應分成 res 成功(回傳原本的資料), error 失敗(判斷失敗的種類: 如果失敗 && 登入過期，就會自動 "舊換新")
    return res // 把成功的請求給 return 出去。
}, async error => { // 0716/ 00:05:10 發生錯誤的話，就會進入這個 error，
    // 在後端的 middlewares/auth.js 會得到 401 錯誤(UNAUTHORIZED)
    // 所以就可以在 apiAuth.interceptors.response 寫 error 如果是 401 的話，
    // 可能就代表 jwt 過期，所以就可以發出舊換新的請求，
    // 0716/ 00:23:45
    // 瀏覽器有錯誤的情況，網路斷線也算是失敗，網路斷線不會有回應，所以要先判斷是否有收到回應。
    if (error.response){
        // 0716/ 00:06:22 、00:24:10
        // 在 passport/passport.js 裡面有寫一個 "登入過期" 的錯誤訊息，
        // 先 get profile 得到 401，點進去 "profile" status code:401 Unauthorized，
        // 可以看 Preview 看傳回來的訊息，可以發現 message: "登入過期"，
        // 立刻送出了 "extend" 重新取得新的一組 jwt(token)，再 "profile" 得到了使用者資訊。

        // 0716/ 00:24:10 如果發生 "登入過期" && 不是舊換新 extend
        // 如果舊換新發生登入過期，邏輯不對，因為在 passport.js 有寫如果有新的 token 的話要給過。
        if(error.response.data.message === '登入過期' && error.config.url !== '/user/extend'){
            const user = useUserStore() // 使用者資訊
            try {
                // back/controllers/user.js/extend 舊換新，在 back/routes/user.js 的 extend 為 .patch
                // 這裡去傳送舊換新
                const { data } = await apiAuth.patch('/user/extend')
                // 更新 stores/user.js 的 token
                user.token = data.result
                // 修改原本發生請求的設定 token
                error.config.headers.Authorization = 'Bearer ' + user.token
                // 重新發送一次原本的請求
                return axios(error.config)
            } catch (_) {
                // 舊換新錯誤，登出
                user.logout()
            }
        }
    }
    // 回傳原本原本錯誤到呼叫 apiAuth 的地方
    return Promise.reject(error)
})

// useApi 函數: 通過函數來封裝邏輯的方式，讓它可以被組件共享和重用。
// useApi 是一個自定義的函數，作為一個 composable，方便在 Vue 組件中使用。
// 在 stores/user.js 中，import { useApi } from '@/composables/axios' 就是上面的方法都可以使用。
// 在到 stores/user.js 中，
// 解構賦值來同時從 useApi() 函數中獲取 api 和 apiAuth 這兩個變數。
// const { api, apiAuth } = useApi() 就可以使用 api 和 apiAuth。
export const useApi = () => {
    // return { api } 會將 api 封裝在一個對象中，並將其返回給組件。
    // 意味著 useApi 函數返回的對象將包含 api 作為其屬性，
    // 從而使得 Vue 組件可以通過 useApi() 來獲取和使用 api
    return { api, apiAuth } // 要記得 return 出去。
} // 0709/ 03:49:40 帶表現在的 composables 裡面有兩個 axios 可以用，一個是 api、一個是 apiAuth。