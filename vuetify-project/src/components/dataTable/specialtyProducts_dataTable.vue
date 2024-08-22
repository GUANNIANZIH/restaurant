<template>
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

    <template #top>
        <v-text-field
            label="搜尋"
            v-model="tableSearch"
            append-icon="mdi-magnify"
            @click-append="tableLoadItems(true)"
            @keydown.enter="tableLoadItems(true)"
        ></v-text-field>
    </template>

    <template #[`item.image`]="{ value }">
        <v-img :src="value" height="50px"></v-img>
    </template>
    <!-- 根據 sell 設定的 value 控制開關，v-if="value" -->
    <template #[`item.sell`]="{ value }">
        <!-- v-if="value" 如果是 true 就會打勾，根據 value 的真假值來決定是否渲染 v-icon-->
        <v-icon icon="mdi-check" v-if="value"></v-icon>
    </template>

    <template #[`item.action`]="{ item }">
    <!-- 使用 defineProps 來接收來自父組件的 openMenuDialog 方法，
        而 defineExpose 是用來暴露組件中的方法，提供給父組件使用。 -->
      <!-- 注意在父、子組件上命名風格不同 -->
    <v-btn icon="mdi-pencil" variant="text" color="#D78A24" @click="onOpenSpecialtyDialog(item)"></v-btn>
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
  onOpenSpecialtyDialog: Function
});

// 定義觸發打開對話框的函數
const onOpenSpecialtyDialog = (item) => {
  console.log('emit')
  mitt.emit('openSpecialtyDialog', item)
  if (props.onOpenSpecialtyDialog) {
    // props.onOpenSpecialtyDialog(item);
  }
};

// dataTable 對應上面 v-data-table-server 所綁定的變數名稱
const tableItemsPerPage = ref(10) // 每頁顯示幾格資料
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
    const { data } = await apiAuth.get('/specialty/all', {
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
