<template>
    <v-container>
      <v-row>

        <v-col cols="12">
          <h1 class="text-center">活動資訊管理頁面</h1>
        </v-col>

        <v-col cols="12">
          <v-btn color="#3C5D44" @click="openDialog(null)">建立活動資訊</v-btn>
        </v-col>

        <v-col cols="12">
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

            <template #[`item.isPublished`]="{ value }">
              <v-icon icon="mdi-check" v-if="value"></v-icon>
            </template>

            <template #[`item.action`]="{ item }">
              <v-btn icon="mdi-pencil" variant="text" color="#3C5D44" @click="openDialog(item)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="#D78A24" @click="deleteItem(item)"></v-btn>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog.open" persistent width="500">
      <v-form @submit.prevent="submit" :disabled="isSubmitting">
        <v-card>
          <v-card-title>{{ dialog.id ? '編輯活動' : '新增活動' }}</v-card-title>
          <v-card-text>
            <v-text-field
              label="名稱"
              v-model="title.value.value"
              :error-messages="title.errorMessage.value"
            ></v-text-field>
            <v-text-field
              label="副標題"
              v-model="subtitle.value.value"
              :error-messages="subtitle.errorMessage.value"
            ></v-text-field>
            <v-textarea
              label="文案內容"
              v-model="content.value.value"
              :error-messages="content.errorMessage.value"
            ></v-textarea>
            <v-select
              label="文章種類"
              :items="categories"
              v-model="category.value.value"
              :error-messages="category.errorMessage.value"
            ></v-select>
            <v-checkbox
              label="發布文章"
              v-model="isPublished.value.value"
              :error-messages="isPublished.errorMessage.value"
            ></v-checkbox>

            <vue-file-agent
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/jpeg,image/png"
              deletable
              max-size="3MB"
              help-text="選擇檔案或拖曳到這裡"
              :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 3MB' }"
              ref="fileAgent"
            ></vue-file-agent>
          </v-card-text>

          <v-card-actions>
            <v-btn color="red" :loading="isSubmitting" @click="closeDialog">取消</v-btn>
            <!-- 送出 type="submit" -->
            <v-btn color="#D78A24" type="submit" :loading="isSubmitting">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  meta: {
    title: '玉食堂 | 活動管理',
    login: true,
    admin: true
  }
})

// 記得 useApi()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
// fillAgent
const fileAgent = ref(null)

const dialog = ref({
  // v-dialog v-model="dialog.open" 綁定預設為 false 關閉狀態
  // 編輯對話框的狀態，預設為關閉狀態
  open: false,
  // 使用 id 來判斷表單是新增(不會有 id)
  // 編輯會有 id，紀錄編輯中的 id
  id: ''
})

const openDialog = (item) => {
  if (item) {
    // 綁定以下，會把編輯商品原本創立的值給帶入 dialog 中。
    dialog.value.id = item._id // item._id，從 item 物件中提取的 _id 值
    title.value.value = item.title
    subtitle.value.value = item.subtitle
    content.value.value = item.content
    category.value.value = item.category
    isPublished.value.value = item.isPublished
  } else {
    dialog.value.id = ''
  }
  dialog.value.open = true
}

// 0716/ 03:38:25 取消 @click="closeDialog"
const closeDialog = () => {
  // 關閉表單
  dialog.value.open = false
  resetForm()
  fileAgent.value.deleteFileRecord()
}

// deleteItem function
const deleteItem = async (item) => {
  try {
    await apiAuth.delete(`/news/${item._id}`)
    createSnackbar({ text: '新增貼文已刪除', color: 'success' })
    tableLoadItems(true)
  } catch (error) {
    createSnackbar({ text: error.response?.data.message || '刪除失敗', color: 'error' })
  }
}

// categories 分類
const categories = ['新品上市', '店休公告', '會員活動']
// yup 欄位驗證
const schema = yup.object({
  title: yup
    .string()
    .required('公告標題必填'),
  subtitle: yup
    .string(),
  content: yup
    .string()
    .required('公告內容必填'),
  category: yup
    .string()
    .required('文章種類必填')
    .test('isCategory', '文章種類錯誤', value => {
      return categories.includes(value)
    }),
  isPublished: yup
    .boolean()
})
// 使用 vee-validate 的 useForm 的 handleSubmit 送出驗證方法, isSubmitting 提交中, resetForm 重設表單
// useForm 會回傳一個物件，裡面有 handleSubmit、isSubmitting、resetForm
// 這裡使用 useForm 來綁定表單
const { handleSubmit, isSubmitting, resetForm } = useForm({
  // 驗證的 schema，代表上面 yup 的 schema
  validationSchema: schema,
  // 設定各個欄位的初始值
  initialValues: {
    title: '',
    subtitle: '',
    content: '',
    category: '',
    isPublished: true
  }
})
// 先使用 useForm 來綁定表單 ，再使用 useField 來綁定欄位
const title = useField('title')
const subtitle = useField('subtitle')
const content = useField('content')
const category = useField('category')
const isPublished = useField('isPublished')

// 0716/ 02:50:35
// vue-file-agent 的上傳圖片套件，這裡要設定設定兩個陣列
const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) return
  if (dialog.value.id.length === 0 && fileRecords.value.length < 1) return
  try {
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('subtitle', values.subtitle)
    fd.append('content', values.content)
    fd.append('category', values.category)
    fd.append('isPublished', values.isPublished)

    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    if (dialog.value.id === '') {
      await apiAuth.post('/news', fd)
      // else 為編輯動作，寫完新增再回來寫編輯
    } else {
      // 0716/ 05:18:10
      // 加上 patch 編輯的路由，並且帶入 id，加上 dialog.value.id，在把 fd 表格資料送出去
      await apiAuth.patch('/news/' + dialog.value.id, fd)
    }
    // 使用 snackbar 提示訊息
    createSnackbar({
      // 0716/ 05:19:10 修改 dialog.value.id === '' ? '新增成功' : '編輯成功',
      text: dialog.value.id === '' ? '新增成功' : '編輯成功',
      snackbarProps: {
        color: '#D78A24'
      }
    })
    closeDialog()
    tableLoadItems(true)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: '#D66425'
      }
    })
  }
})

// dataTable 對應上面 v-data-table-server 所綁定的變數名稱
const tableItemsPerPage = ref(10) // 每頁顯示幾格資料
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '標題', align: 'center', sortable: true, key: 'title' },
  { title: '副標題', align: 'center', sortable: true, key: 'subtitle' },
  { title: '內容', align: 'center', sortable: true, key: 'content' },
  { title: '下單日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
  { title: '種類', align: 'center', sortable: true, key: 'category' },
  { title: '上架', align: 'center', sortable: true, key: 'isPublished' },
  // 新增的 "編輯欄位"，資料庫沒有的欄位
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]
const tableLoading = ref(true) 
const tableItemsLength = ref(0)
const tableSearch = ref('')

const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  // 載入前/後的中間處理寫 try catch
  try {
    // 取得 controllers/product.js 的 getAll 的最後返回的 data 資料
    // 發送一個 GET 請求到 `/product/all`，並從後端獲取數據
    const { data } = await apiAuth.get('/news/all', {

      params: {
        page: tablePage.value,  // 當前的頁碼
        itemsPerPage: tableItemsPerPage.value, // 每頁顯示的項目數量
        sortBy: tableSortBy.value[0]?.key || 'createdAt', 
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
</script>

<!-- 0716/ 01:22:20 -->
<!-- vite-plugin-vue-layouts 引用的語法 -->
<route lang="yaml">
meta:
  layout: admin
</route>
