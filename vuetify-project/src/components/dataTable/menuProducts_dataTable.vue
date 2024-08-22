<template>
<!-- 0716/ 03:53:45 ~ 03:54:45 每個綁定的東西所表的意思 -->
<!-- 0716/ 03:55:20 實作 v-data-table-server -->
<!-- 後台顯示商品的表格畫面 v-data-table-server，同時包含 table、搜尋欄位 -->

<!-- 對應 back/controllers/product.js/getAll 寫的 const sortBy = req.query.sortBy || 'price'
      取的是這裡綁定 v-model:sort-by="tableSortBy" 冒號後面的 key，
      但是在這裡的 const tableSortBy = ref([...])，
      取的是 tableSortBy，
      因為 v-model 是一個雙向綁定的語法糖，通常用來綁定表單元素，但也可以自定義綁定行為，
      "tableSortBy" 代表在父組件中定義的數據變量，通常用來存儲某個表單元素的值。
-->
<!-- 文件名稱: data table - server side tables，元件名稱 v-data-table-server
      所有東西都要綁定 v-bind、v-model，這樣才能跟後端要資料......
      記得要邊寫同時 const 
      v-model:items-per-page="tableItemsPerPage" 一頁有幾個東西 / const tableItemsPerPage = ref(10)
      :headers="tableHeaders" 顯示哪些欄位、欄位設定、固定的欄位不會多不需要 ref / const tableHeaders = [...各欄位]
      :items="tableItems" 現在表格裡面所要顯示的所有東西 / const tableItems = ref([])
      :items-length="tableItemsLength" 全部有幾筆資料，非單頁 / const tableItemsLength = ref(0) 一開始為 0 個
      :loading="tableLoading" 如果換頁會顯示 loading 綁定載入狀態 / const tableLoading = ref(true)
      :search="tableSearch" 如果有做搜尋會顯示搜尋文字是甚麼 / const tableSearch = ref('') 設定空的來當搜尋文字

  03:56:40
  v-model:sort-by="tableSortBy" 紀錄現在表格是對甚麼東西做排序 / const tableSortBy = ref([...])
  sort-by 因為 data table 有支援排序功能，要記現在欄位、正序倒序排都要記
  可以一次支援很多排序，但前端要支援多排序功能，後端就要寫出多排序的功能。
  const tableSortBy = ref([
    { key: 'createdAt', order: 'desc' }
  ])
  'createdAt' 對應傳入 database 的欄位名稱(schema/ timestamp)， 代表建立時間，
  'desc' 代表倒序排列 (新的資料在上面)

  v-model:page="tablePage" 代表當前頁碼(現在表格被翻到哪一頁) / const tablePage = ref(1) 代表一開始在第一頁
  03:59:50 這裡要注意後端要怎麼回應給前端一頁幾個、第幾筆到第幾筆的資料，
  要去看 back/controllers/product.js 的 getALL
  03:59:45 思考如何後端要怎麼用 "每頁幾個、現在第幾頁..." 來判斷現在要回給前端第幾筆到第幾筆的資料。
  -->

  <!-- 0716/ 03:49:30 查詢使用 v-data-table，有區分資料來源的方式(table 都會)
      如果一次把所有資料放在陣列裡面做綁定效能差，會一次載到使用者的裝置上，使用者負擔大
      如果使用 v-data-table-server 會分頁載入、排序，只會載入當前頁面的資料，效能會比較好
      都會去跟後端要 result.data 結果資料，
      假設一次五比資料，第一次載入五筆資料，第二次載入五筆資料，會一直跟 server 要資料
      或是有像是到底會去要資料 infinite scroller、
      或是更多資料的話可以使用 virtual scroller，
      只會 DOM 上顯示當前載入當前畫面的資料，前端計算位置應該要出現的資料跟後端要。
      -->

  <!-- 0716/ 04:07:30 ~ 04:09:10 -->
  <!-- 在特殊時機觸發更新 v-data-table-server 的資料，會寫成一個方法 ， @update:items-per-page="tableLoadItems(false)"
      注意這裡後面綁定的是 :items-per-page 當每一頁顯示幾筆的選項改變時，就會執行這個方法，重新取得資料。
      同道理，當重新排序時 @update:sort-by="tableLoadItems(false)"、當翻頁時 @update:page="tableLoadItems(false)"
      hover 效果
  -->

  <!-- 0716/ 04:09:40 -->
  <!-- 以上表格綁定都設定完成以後，就可以去後端 back/controllers/product.js 把 '商品查詢的路由、api' 寫出來，再回來寫重新再入的方法 @update:..-->
  <v-data-table-server
    v-model:items-per-page="tableItemsPerPage"
    v-model:sort-by="tableSortBy"
    v-model:page="tablePage"
    :items="tableItems"
    :headers="tableHeaders"
    :loading="tableLoading"
    :items-length="tableItemsLength"
    :search="tableSearch"
    @update:items-per-page="tableLoadItems(false)"
    @update:sort-by="tableLoadItems(false)"
    @update:page="tableLoadItems(false)"
    hover
  >
  <!-- 
  0716/ 04:52:40
  搜尋欄位 v-text-field
  前面寫了搜尋但還沒寫內容。
  設定 slot 叫做 #top，在表格的上面增加 v-text-field 搜尋欄位，
  #top 是一个命名插槽（scoped slot），
  通常用在某个组件内，比如在列表或表格组件的頂部添加额外内容。
  綁定 v-model="tableSearch"，
  @click-append、@keydown.enter="tableLoadItems(true)" 執行。
  0716/ 04:55:30
  執行 tableLoadItems 會有問題的原因是假設換頁了，搜尋結果應該要回到第一頁。
  或是可以寫一個 function 看是否要回到第一頁，來共用 tableLoadItems 的東西。
  所以改成都設定 tableLoadItems，區分 true、false，
  再增加判斷式在 tableLoadItems 的方法裡面，
  if (reset) tablePage.value = 1 ，代表回到第一頁。
  -->
  <template #top>
    <v-text-field
      label="搜尋"
      v-model="tableSearch"
      append-icon="mdi-magnify"
      @click-append="tableLoadItems(true)"
      @keydown.enter="tableLoadItems(true)"
    ></v-text-field>
  </template>
  <!-- 0716/ 04:46:50 修改抓取到的 data(controllers/product.js 回傳的 data) 之後欄位的顯示方式-->
  <!-- 使用 template 使用 # 去指定 slot 插槽 ( `item.欄位名稱` )
  < template #[`item.image`]= "data" >
  使用 template、slot 綁定 v-data-table 的 item.image、item.sell、item.action
  如果使用 {{ data }} 可以去看資料回傳內容是甚麼，
  可以使用 value 去抓取到資料的東西，
  直接使用 v-img 去綁定 :src="data.valu
  解構概念: 從一組陣列或是物件中取出特定的值，並且將這些值指定給新的變數，簡潔語法
  原本未解構:
  < template #[`item.image`]= "data" >
  <v-img :src="data.value" height="50px"></v-img>
  也可以使用解構變成:
  < template #[`item.image`]= { value } >
  就會變成  <v-i :src="value" height="50px"></v-i
  依照這個方式去修改欄位顯示的內容
  #[`item.image`]是 Vue.js **插槽屬性绑定** (slot props)，
  將 data 傳遞给插槽内部的内容，
  data是一個物件，裡面有 value 屬性。
  -->

  <!-- 這裡的欄位是前面綁定的 :headers="tableHeaders" 可以去看下面的 const header-->
  <template #[`item.image`]="{ value }">
    <v-img :src="value" height="50px"></v-img>
  </template>
  <!-- 根據 sell 設定的 value 控制開關，v-if="value" -->
  <template #[`item.sell`]="{ value }">
    <!-- v-if="value" 如果是 true 就會打勾
        根據 value 的真假值來決定是否渲染 v-icon
    -->
    <v-icon icon="mdi-check" v-if="value"></v-icon>
  </template>
  <!-- 0716/ 05:12:40
      指定 action 欄位，解構出原始的東西 item 出來，不是 value。
      注意這裡是編輯，要帶資料 @click="openDialog(item)"
      新增才是 @click="openDialog(null)"
  -->
  <template #[`item.action`]="{ item }">
    <!-- 使用 defineProps 來接收來自父組件的 openMenuDialog 方法，
        而 defineExpose 是用來暴露組件中的方法，提供給父組件使用。 -->
      <!-- 注意在父、子組件上命名風格不同 -->
    <v-btn icon="mdi-pencil" variant="text" color="#D78A24" @click="onOpenMenuDialog(item)"></v-btn>
  </template>
</v-data-table-server>
</template>




<script setup>
import { ref } from 'vue'
// 03:06:48 把資料送出去所以要引入 useApi，去跟 API 做通溝，記得 const useApi
// 因為要做新增商品，要登入才可以做新增動作，所以要使用 apiAuth
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import mitt from '@/mitt.js'



// 記得 useApi()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
// fillAgent 上傳圖片套件
// const fileAgent = ref(null)
const tabs = ref(1)

// 接收來自 product.vue 的 prop
const props = defineProps({
  onOpenMenuDialog: Function
});

// 定義觸發打開對話框的函數
const onOpenMenuDialog = (item) => {
  console.log('emit')
  mitt.emit('openMenuDialog', item)
  if (props.onOpenMenuDialog) {
    // props.onOpenMenuDialog(item);
  }
};

// dataTable 對應上面 v-data-table-server 所綁定的變數名稱
const tableItemsPerPage = ref(6) // 每頁顯示幾格資料
const tableSortBy = ref([
  // 改成按照價為排序: 由價位高到低
  { key: 'price', order: 'desc' }
])
const tablePage = ref(1)
const tableItems = ref([])
// tableHeaders 固定的欄位不會多不需要 ref 
// title 欄位顯示名稱
// align: 'center' 欄位靠哪裡排
// sortable: 代表欄位是否可以排序

// 0716/ 04:02:15
// key 一定要跟後端資料庫的欄位要對到!!! 
// 會把符合的 key 值自動帶進這個欄位內!!!!
// 綁定 :headers="tableHeaders"

// 0716/ 05:12:00
// 做完了 "編輯" 的操作，
// 因為 key: 'action' 原本不存在我們定義的原始資料內，代表是一個獨立於資料外的自定義的欄位，
// 所以代表 key: 'action' 式要自己去寫他顯示內容的欄位。
// 寫在上面使用 <template #[`item.action`]> 的方式去寫 action 欄位。
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'center', sortable: true, key: 'name' },
  { title: '價格', align: 'center', sortable: true, key: 'price' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '上架', align: 'center', sortable: true, key: 'sell' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]
const tableLoading = ref(true) 
const tableItemsLength = ref(0)
const tableSearch = ref('')

// 0716/ 04:07:30
// 在特殊時機觸發更新 v-data-table-server 的資料，會寫成一個方法，綁定到上面 @update:items-per-page="tableLoadItems(false)"
// 當表格重新載入、到任何頁面時都會重新 reset

// 0716/ 04:36:35
// 完成 back/controllers/product.js 的 getAll 以後，可以寫 tableLoadItems 更新方法:
// 把表格的資料做請求，再帶入指令裡面
// 載入表格資料
// async (reset) 代表傳遞一個 true 或 false 值给 reset
const tableLoadItems = async (reset) => {
  // 0716/ 04:56:20
  // 如果 reset 參數為 true，則將當前頁面設為 1
  // 所以設定 tableLoadItems(false) 代表不要 reset，表示不需要重置分页，保持當前的頁碼。
  if (reset) tablePage.value = 1
  // 對應 const tableLoading = ref(true)
  // 載入之前把 tableLoading 設定為 true
  tableLoading.value = true
  // 載入前/後的中間處理寫 try catch
  try {
    // 取得 controllers/product.js 的 getAll 的最後返回的 data 資料
    // 發送一個 GET 請求到 `/product/all`，並從後端獲取數據
    const { data } = await apiAuth.get('/product/all', {
      // 設定路由的參數 params: {...}
      // 0716/ 04:38:25
      // 如果在做 get 請求，第一個參數是網址、第二個是網址參數、請求的設定(headers)，get 沒有要送出的資料
      // 跟 post 不一樣，第一個是參數、第二個是要出去的資料、第三個是請求的設定(headers)
      // 在 GET 請求中，params 用來設置 URL 的查詢參數
      params: {
        // 下面的這些 key 是用來組成 HTTP 請求中的查詢參數 (query parameters)
        // 在前端應用中被定義和使用，
        // 以傳遞用戶的表格操作（如翻頁、排序和搜索）的狀態到後端服務器，
        // 然後後端根據這些參數返回相應的數據。
        page: tablePage.value,  // 當前的頁碼
        itemsPerPage: tableItemsPerPage.value, // 每頁顯示的項目數量
        sortBy: tableSortBy.value[0]?.key || 'price',// 表示排序依據的字段名稱
        // ?. 代表排序是可以取消的
        // // 排序依據，默認為 `createdAt`
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value // 搜索字串
      }
    })
    // 0716/ 04:40:15
    // 清空當前的 tableItems，然後將新數據插入到 tableItems 中
    // 從 0 開始，刪除所有東西，...data.result.data 把回來的資料放進去
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data)
    // 更新總項目數量
    // table 的長度是 data.result.total
    tableItemsLength.value = data.result.total
  } catch (error) {
    console.log(error)
    createSnackbar({
      // 優先顯示從服務器返回的錯誤信息，如果服務器沒有提供錯誤信息，則使用一個預設的通用錯誤消息 '發生錯誤'
      // 可選鏈操作符（?.)
      // error?.response?.data?.message：最終嘗試從 data 中訪問 message 屬性
      // error?.response?.data：同理，這一步繼續嘗試從 response 中訪問 data 屬性。如果 response 存在，則試圖訪問 data。
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
  // 載入之後把 tableLoading 設定為 false
  tableLoading.value = false
}
// 寫完方法以後，第一次進來要記得呼叫一次 tableLoadItems 方法 
tableLoadItems()

// 定義要暴露給父組件的方法 (如果需要的話)
defineExpose({
  tableLoadItems
});

</script>
