// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios';
//const { api, apiAuth } = useApi()
// 解構賦值來同時從 useApi() 函數中獲取 api 和 apiAuth 這兩個變數。

// 0709/ 02:14:30
// 這次的 stores 寫法不同，使用 setup store，之前 Pomodoro 是使用 options stores 寫法(actions, state, getters)
// 但其實可以使用 setup store 寫法，先把裡面的大括號拿掉，剩下 export const useAppStore = defineStore('app',...)

// 一樣是定義一個 store，這次來定義一個 user store (用來存使用者登入後存放 token 等等的資料)
// 先將檔名從 app.js 改為 user.js，並將裡面的 app 改為 user
// 因為 user store，所以檔名叫做 user.js，並改為 export const useUserStore = defineStore('user',...) (回去複習 Pinia 命名風格 Pomodoro)

// 0709/ 02:25:45
// Pinia 使用的 setup store 寫法: (可以查看 Pinia 官方文件)
// ref、reactive 相當於 state，action 相當於 function，getter 相當於 computed，但都要加上 return !!!

// 總結上面步驟: 先將檔名改 user.js，並將裡面的 app 改為 user，最後改為 export const useUserStore = defineStore('user',...)
// 第一個參數：'user'，這個參數是 store 的唯一名稱（或 ID），用來識別 store。'user' 是這個 store 的名稱，通常以字符串形式提供。這個名稱在整個應用中必須是唯一的，因為 Pinia 會根據這個名稱來區分不同的 store。

// 後面使用 arrow function 寫法，export const useUserStore = defineStore('user', () => {})
// state 變成 ref/reactive、action 變成一般的 function、getter 變成 computed。
// 來寫使用者的資訊
export const useUserStore = defineStore('user', () => {
    // 先進行 useApi 的引入，再使用解構賦值來同時從 useApi() 函數中獲取 api 和 apiAuth 這兩個變數。
    // login，用 api。
    // profile，用 apiAuth。
    const { api, apiAuth } = useApi()
    // 注意這裡的寫法一樣要 return 回去
    const token = ref('') 
    // 把其他的使用者資訊一併補齊，當後端在登入時會給 account、role、cartQuantity
    // (可以去看 controllers/user.js 的 profile 後端所給前端的資料)
    // 所以前端的 user store 也要存取這些資料
    const account = ref('')
    const phoneNumber = ref('')
    // 0709/ 02:20:20 在 back/enums(列舉)/UserRoles.js 也寫一份在前端，這樣前端就可以 userRole.USER...來判斷身分
    // 因為如果直接寫 0 的話，會不知道是什麼意思，所以要用 enum 來寫
    const role = ref(UserRole.USER) 
    const cart = ref(0) // 這裡是購物車的數量，所以是 0
    const cartSpecialties = ref(0) // 這裡是私廚的數量，所以是 0
    const totalSpent = ref(0) // 這裡是累積消費，所以是 0
    const totalPoint = ref(0) // 這裡是累積點數，所以是 0

    // 新增這些變數來存儲登入時間和員工編號
    const userId = ref('');  // 員工編號
    const loginTime = ref(''); // 登入時間

    // 下面簡單寫 computed
    // isLogin 有無登入
    // 注意因為上面 token、role 使用的都是 ref，所以要加 .value
    const isLogin = computed(() => {
        // 判斷條件為 token 的值，是否大於 0
        // 因為 token.value.length > 0 代表有 token，也就是登入了，這樣 Pinia 才會去存登入後的 jwt 資訊。
        return token.value.length > 0
    })
    
    // isEmployee 是否為員工
    const isEmployee = computed(() => {
        return role.value === UserRole.EMPLOYEE
    })

    // isAdmin 是否為管理員
    const isAdmin = computed(() => {
        // 判斷條件為 role 的值，是否等於 UserRole.ADMIN
        return role.value === UserRole.ADMIN
    })

    // 0709/ 02:30:25 
    // 因為要將 values 資料給帶入，並把 values 帶到後端(下面的 api.post('/user/login', values))
    const login = async (values) => {
        try {
            // 0709/ 02:29:50
            // 這裡只要寫後端的路徑 api.post('/user/login')，因為在 composables/axios.js 中 api 已經設定了 baseURL
            // values 會從 v-form 那邊拉進來，所以這裡只要寫 values 就好
            // baseURL 類似相對位置的概念，所以這裡只要寫後端的路徑就好，所以 api.post('/user/login') 就會 post 到 login

            // 0709/ 02:31:15 
            // values 會從 v-form 那邊拉進來的，會傳入到這個 function 裡面，所以這裡只要寫 values 就好
            // 這裡的 { data } 代表使用者登入後的資訊，這裡使用解構賦值，就可以直接取出 data 使用，看下面的 data.result.token...
            // 把 v-form 的資料 post 去後端，把資料帶入 Pinia 保存資料的裡面。
            const { data } = await api.post('/user/login', values)
            // 可以去看 controllers/user.js 的 login，會回傳一個物件，裡面有 token、account、role、cart(cartQuantity)
            // 更新資料
            token.value = data.result.token
            account.value = data.result.account
            role.value = data.result.role
            cart.value = data.result.cart
            cartSpecialties.value = data.result.cartSpecialties
            totalSpent.value = data.result.totalSpent
            totalPoint.value = data.result.totalPoint
             // 這裡存入登入時間和員工編號
            userId.value = data.result._id;
            loginTime.value = new Date().toLocaleString();  // 取得當前登入時間
            return '登入成功'
        } catch (error) {
            console.log(error)
            // 這邊要回傳錯誤訊息，因為要顯示在前端
            return error?.response?.data?.message || '發生錯誤，請稍後再試'
        }
    }
    // 0709/ 02:35:00 記得 return 回去
    // 先確認 login 登入功能正常，再來寫取得使用者資料的功能 values

    // 0709/ 03:39:25 這裡做每一次重新導向 START_LOCATION 時，都會去檢查使用者的資料 profile
    const profile = async () => {
        // isLogin 在上面定義過，這裡代表如果有登入過。
        // 有登入過再去做處理，如果沒有登入過就 return 不執行。
        if (!isLogin.value) return
        try {
            // 0709/ 03:40:35
            // 設定 data 來接收 api.get('/user/profile') 的資料
            // 修改 api.get，要把使用者的 token 帶出去，get 的第一個是網址、第二個是請求的設定
            // 可以去設定 headers 的 authenication : 'Bearer ' + token.value，這樣就可以帶 token 出去
            // 因為 profile 的路由，在 middlewares 有設定一定要帶 jwt(token) 過去，
            // 所以要去設定 api.get 的請求 headers，帶上 token 去後端，
            // 這樣寫會有一個問題，在每一次登入後，做甚麼操作都要帶這個 token。

            // 0709/ 03:42:00
            // 所以會去 composables/axios.js 做 "建立 api" 的動作一樣，
            // 再去建立一個新的 axios 叫做 apiAuth，
            // apiAuth 可以設定為: 如果是要發 "登入 api 的請求" 可以使用這個來做。
            // 要先 import { useUserStore } from '@/stores/user' 進來，

            // 0709/ 003:43:10
            // 使用一個叫做 "攔截器" 的功能，分成兩個部分，一個是 "請求攔截器"、一個是 "回應攔截器"。
            // 要注意 config.headers.Authorization = 'Bearer ' + user.token ('Bearer ' 有空白)
            // api.get 改成 apiAuth.get
            // 上面 const { api, apiAuth } = useApi()，所以這裡可以直接使用 apiAuth.get
            const { data } = await apiAuth.get('/user/profile')
            // 0709/ 03:47:45 
            // 到 composables/axios.js 去寫一個 authApi 攔截器 interceptors，
            // 就不用每次手動寫下面這些。
            //     {
            //     headers: {
            //         Authorization: 'Bearer ' + token.value
            //     }
            // })
            // 使用 apiAuth 在 interceptors 就會自動幫我們加上 jwt(token) 的動作。
            // 取得目前使用者的資訊後，要記得更新資料，但不需要第一行 token.value = data.result.token
            // 因為上面的 login 就已經取得 token 了!
            // 做這個的目的是為了要取得上一個 api 沒有取到的資料，例如: account、role、cart。
            account.value = data.result.account
            phoneNumber.value = data.result.phoneNumber
            // 前面的因為 ref 要加上，後面自後端響應中的 data.result.token 資料賦值給 token 這個響應式變數
            // 將從後端取得的結果資料 (data.result) 分別存入四個響應式變數 token, account, role, cart 中。
            role.value = data.result.role
            cart.value = data.result.cart
            cartSpecialties.value = data.result.cartSpecialties
            totalSpent.value = data.result.totalSpent
            totalPoint.value = data.result.totalPoint

        } catch (error) {
            console.log(error)
            // 0709/ 03:50:55
            // 如果有發生錯誤的話，要把東西都清空，寫一個簡單的 function 把東西都清空，獲釋都變成預設值。
            // 讓東西都變空的、歸零。
            token.value = ''
            account.value = ''
            role.value = UserRole.USER
            cart.value = 0
            cartSpecialties.value = 0
            totalSpent.value = 0
            totalPoint.value = 0
        }
    }

    // 0709/ 04:18:45
    // 登出是對使用者的狀態做操作，所以要寫在 user store 裡面
    const logout = async () => {
        try {
            // 登出需要 JWT token，所以要用 apiAuth，自動去帶出 jwt，登出用 delete
            await apiAuth.delete('/user/logout')
        } catch (error) {
            console.log(error)
            // 0709/ 04:20:30
            // 登出如果有錯誤
        }
        // 把所有 stores 的值都清空，讓使用者變成登出狀態
        token.value = ''
        account.value = ''
        role.value = UserRole.USER
        cart.value = 0
        totalSpent.value = 0
        totalPoint.value = 0
    }

    // 0717 02:13:30
    // 處理會員暫存的購物車資訊
    // addCart 函式: 接受兩個參數：product 和 quantity。將某個產品和數量添加到購物車。
    const addCart = async (product, quantity, customizationsData = {}) => {
        try {
            // const { data } 是 JavaScript 中的解構賦值語法，
            // 用於從一個物件中提取特定的屬性並賦值給變數。
            // 這個解構賦值是用來從 Axios 的響應中提取 data 屬性。

            // const { data } =  向伺服器發送一個 PATCH 請求，更新使用者的購物車資料。
            // /user/cart 是 API 的端點。
            // 請求的 payload 包含 product 和 quantity。
            // await 關鍵字使該函數等待請求完成，並從伺服器返回的響應中解構出 data。
            const { data } = await apiAuth.patch('/user/cart', {
                product, quantity, customizations: customizationsData
            })
            // cart.value 是對應上面的 const cart = ref(0)
            // data.result.cart 是伺服器返回的更新後的購物車數據
            cart.value = data.result.cart
            return {
                text: '加入購物車成功',
                color: '#3C5D44'
            }
        } catch (error) {
            return error?.response?.data?.message || '發生錯誤，請稍後再試'
        }
    }

    const addSpecialtyCart = async (product, quantity) => {
        try {
            const { data } = await apiAuth.patch('/user/cartSpecialty', {
                product, quantity
            })
            cartSpecialties.value = data.result.cartSpecialties
            return {
                text: '加入私廚購物車成功',
                color: '#3C5D44'
            }
        } catch (error) {
            return error?.response?.data?.message || '發生錯誤，請稍後再試'
        }
    }

    const checkout = async () => {
            try {
            // 不需要傳遞資料過去，因為購物車的內容已經都在資料庫了
            // order : router.post('/', auth.jwt, create)
            await apiAuth.post('/order')
    
            // 發送累積消費金額的路由
            const calculateTotalSpent = await apiAuth.post('/user/calculate-totalSpent')
            if (calculateTotalSpent.data.success) {
                // 更新前端的 totalSpent 和 totalPoint 的值
                totalSpent.value = calculateTotalSpent.data.result.totalSpent
                totalPoint.value = calculateTotalSpent.data.result.totalPoint
            } else {
                throw new Error('累積消費計算失敗，請稍後再試');
              }
            // 成功之後把購物車清空
            cart.value = 0
    
            return {
              color: '#3C5D44',
              text: '結帳成功'
            }
            //  0717 03:43:15
            //  這裡的錯誤 return 的是物件，如果這裡 return 的是 promise.reject 的話，
            // 引用在 profile.vue 的 checkout 才會進到 catch，
            // 所以 profile.vue 的 checkout 不用 try catch。
            } catch (error) {
                console.log(error)
                return {
                    // color: 'red',
                    text: error?.response?.data?.message || '發生錯誤，請稍後再試'
                }
                }
            }

    // 0717 03:40:30 可以把 checkout 寫在 stores/user.js 裡面
    // 把所有跟使用者相關的東西方法都寫在 stores 裡面。
    const checkoutSpecialty = async () => {
        try {
        // 不需要傳遞資料過去，因為購物車的內容已經都在資料庫了
        // order : router.post('/', auth.jwt, create)
        await apiAuth.post('/order/specialty')

        // 成功之後把購物車清空
        // cart.value = 0
        // 添加清空 cartSpecialties 的操作
        cartSpecialties.value = 0 

        return {
            color: '#3C5D44',
            text: '結帳成功'
        }
        //  0717 03:43:15
        //  這裡的錯誤 return 的是物件，如果這裡 return 的是 promise.reject 的話，
        // 引用在 profile.vue 的 checkout 才會進到 catch，
        // 所以 profile.vue 的 checkout 不用 try catch。
        } catch (error) {
            console.log(error)
            return {
                text: error?.response?.data?.message || '發生錯誤，請稍後再試'
            }
            }
        }

    // 0709/ 02:37:15 回去 pages/member.vue 去寫 "登入" 的東西.......
    return {
        token,
        account,
        phoneNumber,
        role,
        cart,
        cartSpecialties,
        totalSpent,
        totalPoint,
        // 上面的 token, account, role, cart 是用來存放使用者登入後的資料
        userId,
        loginTime,
        isLogin,
        isEmployee,
        isAdmin,
        // isLogin, isAdmin 是用來判斷使用者是否登入、是否為管理員
        login,
        profile,
        // 0709/ 03:53:35
        // 上面 login, profile 都處理完後，要回到 router/index.js。
        logout,
        // 0709/ 04:21:00 完成 "登出"
        addCart,
        addSpecialtyCart,
        // 0717 02:15:20 完成 "加入購物車"，
        // 0717 02:17:15 把 "加入購物車"的方法放到 v-btn，回到 components/productCard.vue、pages/products/[id].vue
        checkout,
        checkoutSpecialty
    }
},{
    // 0709/ 03:12:15、03:15:00
    // 設定 user 保存 localStorage 的 key 為 shop，並設定只保存 token 的資料。
    // LocalStorage 持久化
    persist: {
    key: 'shop',
    // 添加 cart 和 cartSpecialties
    paths: ['token', 'cart', 'cartSpecialties']
    }
})

// 0709/ 02:27:25
// 這邊都處理完 user store 了，接下來要處理 "登入"
// 登入的寫法很多人都不一樣，因為登入成功時會對使用者做操作，會將上面設定的 token, account, role, cart 賦值
// 所以有些人會因為 "方便管理" ，所以將登入的請求寫在 user store 裡面
// 但有些人認為登入是代表 "表單送出"，所以會把請求的 api 放在 pages/member.vue 處理登入的檔案內
// 這裡使用 "使用者 store" 的方式，將登入的 api 放在 user store 裡面

// 0709/ 02:28:05
// 所以回到 pages/member.vue 的 loginForm.vue 元件中，將 const { api } = useApi() 拿掉 !!!
// 把原本寫在 loginForm.vue 的 axios.post 放到 user store 裡面，import { useApi } from '@/composables/axios';
