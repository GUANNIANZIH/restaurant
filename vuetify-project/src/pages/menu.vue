<template>
    <v-container fluid>
      <!-- MENU -->
      <v-row class="mx-6">
        <v-col cols="12">
          <h4 class="text-h2">MENU 菜單</h4>
        </v-col>
      </v-row>
      <!-- 菜單導航分類 -->
      <v-row class="mx-6">
        <v-col
        cols="12"
        >
          <!-- 使用 v-tabs 標籤包 v-tab 跑 v-for -->
          <!-- grow 均勻地分佈並填滿整個容器 -->
          <v-tabs
            v-model="tab"
            grow
            bg-color="#3C5D44"
            height="62"
            next-icon="mdi-arrow-right"
            prev-icon="mdi-arrow-left"
            show-arrows
            slider-color="#D78A24"
          >
          <!-- :value="category" -->
            <v-tab v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>

    <!-- 菜單顯示 -->
    <v-container fluid>
      <!-- <v-carousel
        hide-delimiters
        prev-icon="mdi-chevron-left"
        next-icon="mdi-chevron-right"
        height="auto"
        >
        <v-carousel-item
          v-for="(chunk, index) in filteredMenuItems"
          :key="index"
        > -->
          <v-row class="d-flex justify-center">
            <!-- v-for="(item, itemIndex) in chunk" -->
            <!-- 改成 v-for="product in products(商品清單陣列)" -->
            <v-col
              v-for="(product, index) in filterProducts"
              :key="index"
              class="d-flex justify-center align-center p-2"
              cols="12"
              md="6"
              lg="4"
            >
            <!-- 商品卡這裡要調整 -->
            <!-- <component
              :is="product.isSpecial ? 'SpecialProductCard' : 'ProductCard'"
              v-bind="product"
            /> -->
              <ProductCard v-bind="product" />
            </v-col>
            <!-- <v-col
              v-for="product in products" :key="product._id"
              class="d-flex justify-center align-center p-2"
              cols="12"
              md="6"
              lg="3"
            >
              <ProductCard v-bind="product" />
            </v-col> -->
            <v-col cols="12">
                  <!-- v-pagination 分頁元件 -->
                  <!-- 0717/ 00:30:00、00:43:00 -->
                  <v-pagination v-model="page" :length="pages" rounded="circle" @update:model-value="loadProducts" ></v-pagination>
            </v-col>
          </v-row>
      <!-- </v-carousel-item>
    </v-carousel> -->
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
// Vuetify 提供的一個 Composition API，用來檢查當前設備的顯示屬性
import { useDisplay } from 'vuetify'
// 取資料要把 API 方法拉進去
import { useApi } from '@/composables/axios.js'
import { useSnackbar } from 'vuetify-use-dialog'
// Components
import ProductCard from '../components/card/productCard.vue'

definePage({
  name: 'Menu',
  meta: {
    title: 'MENU',
    login: false,
    admin: false
  }
})

// 取資料用的 api
const { api } = useApi();
// 使用 useDisplay 來檢查當前設備的顯示屬性
// const { breakpoint } = useDisplay();

const createSnackbar = useSnackbar()
// 當前選中的分類
const tab = ref('炒飯 | Fried Rice');
// 分類清單
const categories = ref(['炒飯 | Fried Rice', '炒麵 | Fried Noodles', '湯麵 | Soup Noodles','炒米粉 | Fried Vermicelli', '湯米粉 | Soup Vermicelli', '湯品 | Soup', '小品 | Dishes','新品上市']);
// 0717/ 00:32:35 商品清單陣列 ref([])
const products = ref([])

// 儲存所有產品的反應式變數
const filterProducts = computed(()=>{
  return products.value.filter(product => product.category === tab.value)
})

// pages 代表總頁數
// 綁定 :length="pages" 來設定總頁數
const pages = ref(1);

// page 代表當前頁數
// 綁定 v-pagination 的 v-model
const page = ref(1);

// 0717/ 00:34:40 
// 真的不會改的變數名稱，全部使用大寫，ITEMS_PER_PAGE 是一頁顯示 20 個，如何使用總筆數算出全部有幾頁
// const ITEMS_PER_PAGE = 48

// 0717 01:03:42 單一商品頁建立，使用 products/[id].vue
// 因為不會為每個商品都各自去建立一個頁面，前端的顯示的部分，可以使用跟 node.js 一樣，
// 使用動態路由 (冒號 :)，這樣就可以使用同一個頁面去顯示不同的商品
// 一般在去設定路由 routes=[{ path: '/:id' }]，類似 Pomodoro 的作法。
// 0717 01:04:05 概念同當我們在寫 routes/product.js 的 express 的路由 router.get('/:id', getId)，
// 會把接在斜線 / 後面的名字抓下來，給一個名字叫做 id
// Vue.js 的路由也是這樣寫，
// 但因為 Vuetify 是使用 "自動把檔案生成" 的套件 unplugin-vue-router (可以去 pakage.json 查看)
// 寫法會變成要在 pages 資料夾下面建立一個資料夾叫做 products(因為有很多 product)，然後在裡面建立一個檔案叫做 [id].vue
// [id].vue 的意思為把 product 的 id，當作這個檔案的名稱，這樣就可以使用同一個頁面去顯示不同的商品
// 路由同自動變成等於 /products/:id，等於在 products 的資料夾裡面，把 [id] 當作變數，把冒號 : 變成中括號 []，
// 在 products 的資料夾裡面，把:id 當作變數 [id]
// 0717 01:05:40 就可以直接在 products/[id].vue 裡面寫各個商品頁的模板


// 0717/ 00:32:45 取商品的方法
const loadProducts = async () => {
  try {
    // 0717/ 00:34:00
    // 注意 /product 是後端的路由，在 index.js 裡面設定
    // { data } 是解構賦值，取得 api.get('/product') 的 data
    // 這裡的 get 是 controllers/product.js 裡面的 get (所有人都可以取得商品，無須登入)
    const { data } = await api.get('/product', {
    // 0717/ 00:36:25
    // 傳遞參數到後端，讓後端知道一頁有幾個的做法，
    // 可以對照 admin/product.vue 下面所綁定的 data-table 的參數，因為使用的 get 方法是根據 getAll 做管理者取得的方法去複製的
    // 所以參數可以對照 admin/product.vue 的 data-table 的參數
    // params: {...} 傳參數
    // params: {
    //   // 0717/ 00:37:00
    //   // 寫法同 admin/product.vue，可以去看 const tableLoadItems...的 params 參數
    //   // 傳參數過去讓後端知道一頁有幾個，可以參考 product.js 傳遞參數的 key
    //   // 沒以做排序、搜尋，會依照建立時間排序，如果要做搜尋看 0716 lesson
    //   itemsPerPage: ITEMS_PER_PAGE, // 一頁顯示幾個
    //   page: page.value // 當前頁數
    // }
    })

    // 0717/ 00:35:40
    // 對應 controllers/product.js 裡面的 get 的 const total 回傳的東西在 total
    // data.total 是取得總筆數，除以 ITEMS_PER_PAGE 是一頁有幾個
    // 去上面設定顯示 "一頁20個"，記得不會改變的變數，習慣用大寫設定
    // const ITEMS_PER_PAGE = 20
    // 一頁有 20 個，如何使用總筆數算出全部有幾頁
    // Math.ceil 是無條件進位，
    // pages.value = Math.ceil(data.result.total / ITEMS_PER_PAGE)
    // 0717/ 00:36:00
    // products 是上面定義商品清單的陣列，會使用 product in products
    // 把陣列的內容換掉，所以陣列從 0 開始清除陣列長度 products.value.length(整個陣列的長度，表示刪除陣列中的所有元素)
    // ...data.result.data 是把 data.result.data 的所有元素展開並插入到陣列中。
    products.value.splice(0, products.value.length, ...data.result.data)
  } catch (error) {
    // 複製 admin/product.vue 的錯誤處理
    // 記得 snackbar
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
// 0717/ 00:36:20 
// 記得要執行
loadProducts()

</script>

<style scoped>
.scrollable {
  overflow-x: auto;
  white-space: nowrap;
}
.pa-2 {
  padding: 8px !important;
}
.w-75 {
  width: 75% !important;
}
.mb-4 {
  margin-bottom: 16px !important;
}
</style>

