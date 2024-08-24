<template>
<v-container>
    <!-- 會員資訊專區 -->
    <v-row class="mb-6">
        <v-col cols="12" md="12" lg="12">
            <v-card
            class="text-center justify-center py-6">
                <!-- 會員卡圖示 -->
                <v-img 
                src="@/assets/profile/玉食堂會員卡.png" 
                alt="Member Card" 
                height="380px"
                ></v-img>
                <v-card-title>
                    玉食堂貴賓會員卡
                </v-card-title>
                <v-card-subtitle>
                    累積消費：{{ user.totalSpent }}元
                </v-card-subtitle>
                <v-card-subtitle>
                    累積點數：{{ user.totalPoint }}點
                </v-card-subtitle>
            </v-card>
        </v-col>    
        <v-col cols="12" md="12" lg="12">
            <!-- 會員詳細資訊 -->
            <v-card
            class="text-center justify-center py-6">
                <v-card-title>會員資料</v-card-title>
                <v-card-text>
                <!-- <pre>{{ user }}</pre> -->
                <p>會員帳號: {{ user.account }} </p>
                <p>電話: {{ user.phoneNumber }} </p>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <!-- 會員的購物車資訊 / 訂單紀錄 -->
    <v-tabs
    v-model="tabs"
    color="#3C5D44"
    grow
    >
      <v-tab :value="1">
          <v-icon icon="mdi-rice"></v-icon>
          <span>即時餐點購物車</span>
      </v-tab>
      <v-tab :value="2">
          <v-icon icon="mdi-chef-hat"></v-icon>
          <span>預購私廚購物車</span>
      </v-tab>
      <v-tab :value="3">
          <v-icon icon="mdi-view-list"></v-icon>
          <span>即時餐點訂單查詢</span>
      </v-tab>
      <v-tab :value="4">
          <v-icon icon="mdi-view-list"></v-icon>
          <span>私廚訂單查詢</span>
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tabs">
      <!-- 會員購物車資訊 -->
      <v-tabs-window-item :value="1">
        <v-card>
          <v-sheet cols="12" class="ma-5 text-center">
            <h2 class="text-center">我的即時餐點購物車</h2>
          </v-sheet>
          <!-- 0717 02:42:20
              <data-table-server :items="cartItems" />
              做會員購物車畫面，把該取的資料都取出來使用。
              取 "目前使用者的購物車" 可以寫在 stores/user.js 或是可以寫在這裡頁面上。
              這裡選擇直接寫在這裡頁面。
              先 import { useApi }...
          -->
          <!-- 0717 02:49:00 綁定 items、headers -->
          <v-data-table :items="items" :headers="headers">
            <template #[`item.p_id.name`]="{item}">
              <span v-if="item.p_id.sell">{{ item.p_id.name }}</span>
              <span v-else class="text-red">{{ item.p_id.name }} (已下架)</span>
            </template>
            <template #[`item.customized`]="{item}">
              <ul>
                <li v-if="item.customizations['加辣']">辣度: {{ item.customizations['加辣'] }}</li>
                <li v-if="item.customizations['加蛋 +15'] === 'true'">加蛋 +15</li>
                <li v-if="item.customizations['加飯 +15'] === 'true'">加飯 +15</li>
                <li v-if="item.customizations['加沙茶 +15'] === 'true'">加沙茶 +15</li>
                <li v-if="item.customizations['加料 +45'] === 'true'">加料 +45</li>
              </ul>
            </template>
            <template #[`item.quantity`]="{item}">
              <v-btn variant="text" color="red" @click="addCart(item.p_id._id, -1)">-</v-btn>
              <span>{{ item.quantity }}</span>
              <v-btn variant="text" color="green" @click="addCart(item.p_id._id, 1)">+</v-btn>
            </template>
            <template #[`item.action`]="{item}">
              <v-btn variant="text" color="#D78A24" icon="mdi-delete" @click="addCart(item.p_id._id, item.quantity * -1)"></v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-sheet class="ma-5 text-center">
          <p>總金額: {{ total }}</p>
          <!-- :disabled="!canCheckout" 判斷 disabled 為不能結帳 !canCheckout 才關閉結帳狀態
              因為 canCheckout 是 computed，當購物車為空或有商品已下架時，canCheckout 會返回 false，無法結帳。
              當點擊 @click="checkout" 可以進行結帳。
          -->
          <v-btn color="#3C5D44" :disabled="!canCheckout" @click="checkout">結帳</v-btn>
        </v-sheet>
      </v-tabs-window-item>

      <!-- 會員預購商品購物車資訊 -->
      <v-tabs-window-item :value="2">
        <CartSpecialty />
      </v-tabs-window-item>

      <!-- 會員訂單資訊 -->
      <v-tabs-window-item :value="3">
        <!-- 把私廚的訂單一併匯入會員訂單資訊 -->
        <ProfileOrder_DataTable />
      </v-tabs-window-item>

      <v-tabs-window-item :value="4">
        <!-- 把私廚的訂單一併匯入會員訂單資訊 -->
        <ProfileOrderSpecialty_DataTable />
      </v-tabs-window-item>

    </v-tabs-window>
</v-container>
</template>

<script setup>
// 0717 03:00:25
// 增加 computed 的功能，可以用來計算總金額、可否 check-out 的 computed
// 對應下面的 total 方法
import { ref, computed, onMounted } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
// 0717 02:43:06
// 引入 useApi 用來發請求
import { useApi } from '@/composables/axios.js'
// 結帳完可能需要跳頁 useRouter
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

// 引用 data-table 的元件
// 改成只拆 profileOrder_dataTable 出去寫成一個元件
import ProfileOrder_DataTable from '@/components/dataTable/profileOrder_dataTable.vue'
import ProfileOrderSpecialty_DataTable from '@/components/dataTable/profileOrderSpecialty_dataTable.vue'
import CartSpecialty from '@/components/card/cartSpecialty.vue'

// import { useMemberData } from './useMemberData'; // 假設我們有一個 composable 來獲取會員數據

definePage({
    name: 'Profile',
    meta: {
        title: 'CART & PROFILE',
        login: true,
        admin: false
    }
})

// const { memberInfo, cartItems, orderHistory } = useMemberData(); // 獲取會員數據
const tabs = ref(1); 
// 引入 useApi 用來發請求，需要驗證 apiAuth
const { apiAuth } = useApi()
// 結帳完可能需要跳頁 useRouter
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

const totalSpent = ref(0);
const totalPoint = ref(0);


// 0717 02:44:45
// items 陣列存取購物車的商品
const items = ref([])
// header 定義 data-table 欄位名稱
// 不能只寫 name，要寫 key: 'p_id.name'，因為東西在 populate 裡面

// 使用 value 來計算單筆訂單的總價
// headers 有東西叫做 value，可以寫資料產生的方式，預設會有一個參數，帶表現在正在顯示的項目 * 項目
const headers = [
  { title: '品名', key: 'p_id.name' },
  { title: '客製化需求', key: 'customized' },
  { title: '單價', key: 'p_id.price' },
  { title: '數量', key: 'quantity' },
  { title: '總價', key: 'total', 
  value: item => item.p_id.price * item.quantity },
// 0717 02:48:15
// action 欄位可以自己加
  { title: '操作', key: 'action' }
]

// 0717 02:49:35
// loadItems 取得購物車商品
const loadItems = async () => {
  try {
    // apiAuth.get
    // router.get('/cart', auth.jwt, getCart) 取得購物車
    const { data } = await apiAuth.get('/user/cart')
    // items 陣列存取購物車的商品
    // data 是上面的 { data } 解構出來的
    items.value = data.result
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: '#D78A24'
      }
    })
  }
}
loadItems()

// 0717 03:00:45
// computed 是 Vue 用於計算屬性的函數，這裡的 computed 將購物車總金額的計算邏輯封裝在一起。
// total 用來計算總共有多少東西，
// 當依賴的數據（如 items）改變時，total 會自動重新計算。
const total = computed(() => {
    // items 代表購物車所有東西的陣列，因為 ref 所以要加 .value
    // .reduce 累加，裡面放 function(total, current 目前兩個參數)，可以去複習 reduce
    // reduce 是一個陣列方法，用於將陣列中的所有元素累加為一個單一的值。reduce 的第一個參數是一個回呼函數，它接收兩個參數:
    // total：累加器，用來累加每個項目的計算結果。
    // current：陣列當前被迭代的元素（即購物車中的一個商品）
  return items.value.reduce((total, current) => {
    // 每一次把 total 總金額，去加上現在的東西 current.quantity 數量 * current.p_id.price 價錢
    // current.quantity 是商品的數量。
    // current.p_id.price 是商品的單價
    return total + current.quantity * current.p_id.price
  // 從 0 開始計算
  }, 0)
})

// 0717 03:01:55
// computed 返回一個 boolean，用來判斷購物車是否可以結帳:
// 當依賴的數據（如 items）改變時，canCheckout 會自動重新計算。
const canCheckout = computed(() => {
    // items 代表購物車所有東西的陣列。
    // 判斷陣列長度是否大於 0，因為大於 0 才可以結帳，

    // .some() 是 JavaScript 陣列方法，用來檢查陣列中是否有至少一個元素滿足條件。
    // 單看 items.value.some(item => !item.p_id.sell) 代表有沒有包含任何已經下架的商品。
    // 加上 ! 代表沒有包含以下架的商品才可以結帳。

    // && 而且 !items.value.some(item => !item.p_id.sell) 不包含任何已下架的商品，
    // item => !item.p_id.sell 是條件判斷，檢查每個商品是否已下架（即 item.p_id.sell 為 false）。
    // 如果購物車中有任何一個商品已下架，item.p_id.sell 就會返回 false，此時 !item.p_id.sell 會返回 true。
    // 這裡的 function 條件為: 用來判斷是否已下架，
    // 整個條件 !items.value.some(item => !item.p_id.sell) 的意思是檢查購物車中是否沒有下架的商品。
  return items.value.length > 0 && !items.value.some(item => !item.p_id.sell)
  // return items.value.length > 0 && !items.value.some(item => !item.p_id.sell)：
  // 最後返回的是一個布爾值：true：表示購物車中有商品，false：表示購物車為空或有商品已下架，無法結帳。

    // 0717 03:03:55 兩個 total, canCheckout 就可跳用到上面...
})

// 0717 03:39:45
// 結帳要做防止使用者一直送出，一開始預設為 false
const loading = ref(false)

// 0717 03:39:05
// 結帳方法
const checkout = async () => {
  // 結帳要做防止使用者一直送出，加上 const loading = ref(false)
  // 顯示結帳過程的加載指示器，告訴用戶系統正在處理請求。
  loading.value = true
  // 0717 03:40:30 可以把 checkout 寫在 stores/user.js 裡面
  // 把所有跟使用者相關的東西方法都寫在 stores 裡面。

  // 0717 03:43:15
  // 因為在 stores/user.js/checkout catch 的錯誤 return 的是物件，
  // 如果 return 的是 promise.reject 的話，
  // 引用在 profile.vue/checkout 才會進到 catch，
  // 所以 profile.vue 的 checkout 不用 try catch。
  const result = await user.checkout()
  createSnackbar({
    text: result.text,
    snackbarProps: {
        color: result.color
      }
  })

  // 加上一個路由跳轉業面的判斷
  if (result.color === '#3C5D44') {
    // 路由跳頁改到 tab(2)，這裡要去對應 default.vue 的 to: 的名稱
    router.push('/')
  }
  loading.value = false
}

// 加入購物車方法 :
const addCart = async (product, quantity) => {
  const result = await user.addCart(product, quantity)
  createSnackbar({
    text: result.text,
    snackbarProps: {
      color: result.color
    }
  })
  if (result.color === '#3C5D44') {
    const idx = items.value.findIndex(item => item.p_id._id === product)
    items.value[idx].quantity += quantity
    if (items.value[idx].quantity <= 0) {
      items.value.splice(idx, 1)
    }
  }
}

// 累積消費、累積點數 API
const updateUserSpentAndPoints = async () => {
  try {
    // 發送累積消費金額並更新點數的請求
    const response = await apiAuth.post('/user/calculate-totalSpent')

    if (response.data.success) {
      // 更新狀態管理中的 totalSpent 和 totalPoints
      totalSpent.value = response.data.totalSpent
      totalPoint.value = response.data.totalPoints
    
    // 更新使用者資料
    await user.profile()

  } else {
    throw new Error('更新使用者累積消費、累積點數失敗')
  }
} catch (error) {
    console.log(error)
    console.error('更新使用者累積消費、累積點數失敗', error)
  }
}

// 在組件掛載時執行 :
onMounted( () => {
  loadItems()
  updateUserSpentAndPoints()
})

</script>

<style scoped>
</style>