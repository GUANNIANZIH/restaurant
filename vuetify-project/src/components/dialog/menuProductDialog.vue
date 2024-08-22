<template>
<!-- 0716/ 01:57:00 -->
<!-- 文件示範: 在 v-dialog 裡面去寫 v-slot:activator 插槽，去寫 dialog 如何打開 -->
<!-- 但不用示範的方式，因為這樣會寫太多 v-dialog，只想要寫一個 v-dialog 去綁定全部的 product 上架 -->
<!-- 01:57:30 將開關的狀態另外去寫成一個 data -->
<!-- 0716/ 02:05:35 新增、編輯的表單處理，如果覺得一頁太多東西可以使用元件的方式將東西獨立出去，但沒辦法跟 v-btn 新增動作拆開? -->
<!-- 如果獨立寫 dialog 元件，要確保 v-dialog 元件的顯示狀態由 menu.vue 控制。你可以使用 v-model 或 :value 和 @input 來將狀態從 menu.vue 傳遞到 v-dialog 組件。 -->

<!-- 對應下面的 dialog.value.open = true、固定寬度 persistent width="500" -->
<!-- v-dialog 使用 v-form 包 v-card，綁定 v-model="dialog.open" 預設 open="false" 狀態-->
<!-- 要記得對應原本文件的 v-btn 的點擊事件，新增商品 @click="openDialog(null)" -->
<v-dialog v-model="dialog.open" persistent width="500">
    <!-- 02:04:35 v-form 寫法同 "註冊、登入" 驗證寫法，使用 vee-validate、yup 套件 -->
    <!-- 03:01:35 執行  @submit.prevent="submit"，然後去寫送出的方法 submit，並執行 useForm 的 handleSubmit 驗證
    這裡要注意不會幫我們驗證 vue-file-agent 的圖片上傳 (fileRecords)，要自己寫驗證 -->
    <v-form @submit.prevent="submit" :disabled="isSubmitting">
      <v-card>
        <!-- 02:03:00 寫簡單的判斷式 {{ dialog.id ? '編輯商品' : '新增商品' }} -->
        <!-- if 有 id 的話 dialog.id ? '編輯商品' else : '新增商品' -->
        <!-- 02:04:20 寫完前面設定以後險去測試按下 @click="openDialog" 會不會打開 -->
        <v-card-title>{{ dialog.id ? '編輯商品' : '新增商品' }}</v-card-title>
        <!-- 0716/ 02:05:15 -->
        <!-- v-card-text 裡面放表單的欄位，可以對照 product 的 schema 去做 -->
        <!-- v-form 寫法同 "註冊" 寫法，使用 vee-validate、yup 套件 -->
        <v-card-text>
          <!-- v-text-field 文字輸入欄位，
          綁定 name (看 product schema)，v-model="name.value.value" -->
          <v-text-field
            label="名稱"
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
          ></v-text-field>
          <!-- 綁定 price -->
          <v-text-field
            label="價格"
            type="number" min="0"
            v-model="price.value.value"
            :error-messages="price.errorMessage.value"
          ></v-text-field>
          <!-- 02:09:35 使用 v-select 下拉選單，02:10:00 如果要讓使用者自己輸入內容、過濾可以用 autoCompletes-->
          <!-- v-select 可以設定顯示名稱、代表值，return object 回傳整個物件非值-->
          <!-- 綁定 category (看 product schema) -->
          <!-- 注意 :items 綁定跟 v-model 綁定的單複數差異 -->
          <!-- 02:12:20 :items 綁定 categories 分類，注意分類要看 schema 有哪幾個就要出現哪幾個 -->
          <!-- v-model="category.value.value" -->
          <v-select
            label="分類"
            :items="categories"
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
          ></v-select>
          <!-- 綁定 sell 上下架 -->
          <v-checkbox
            label="產品上市"
            v-model="sell.value.value"
            :error-messages="sell.errorMessage.value"
          ></v-checkbox>
          <!-- 綁定 description 說明欄位-->
          <v-textarea
            label="餐點描述"
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
          ></v-textarea>
          <!-- 
          02:50:50 vue-file-agent-next 圖片上傳套件
          注意要給兩陣列: 
          綁定欄位 v-model="fileRecords"、
          綁定原始欄位 v-model:raw-model-value="rawFileRecords" 
          raw-model-value 代表是一個自定義的綁定屬性名稱，將 rawFileRecords 綁定到該屬性
          const fileRecords = ref([])
          const rawFileRecords = ref([]) 

          accept="image/jpeg,image/png" 可以接受的檔案格式
          deletable 代表可以被刪除
          max-files="3" 代表最多上傳 3 張圖片，預設是 1
          很多 text props 可以設定，看文件
          help-text="選擇檔案或拖曳到這裡" 代表提示文字
          :error-text="{ type(型態): '檔案格式不支援', size(檔案大小): '檔案大小不能超過 1MB' }"
          02:56:25 因為要綁定物件所以前面一定加上 "冒號 :"
          03:00:40 在 fileRecords 裡面有 error，所以如果 error 是 false 代表有東西
          -->
          <vue-file-agent
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/jpeg,image/png"
            deletable
            max-size="5MB"
            help-text="選擇檔案或拖曳到這裡"
            :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 5MB' }"
            ref="fileAgent"
          ></vue-file-agent>
        </v-card-text>
        <!-- 0716/ 02:03:35 -->
        <!-- 按鈕 v-card-actions -->
        <v-card-actions>
          <!-- 0716/ 03:38:05 取消 @click="closeDialog" -->
          <v-btn color="red" :loading="isSubmitting" @click="closeDialog">取消</v-btn>
          <!-- 送出 type="submit" -->
          <v-btn color="green" type="submit" :loading="isSubmitting">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
</v-dialog>

<!-- <menuProducts_dataTable ref="dataTableRef" v-show="false"/> -->
</template>

<script setup>
// 不用引入 defineProps, defineEmits 發射事件 emit，常常一起使用來定義組件的接口和事件處理。
import { ref, reactive, onMounted } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
// 03:06:48 把資料送出去所以要引入 useApi，去跟 API 做通溝，記得 const useApi
// 因為要做新增商品，要登入才可以做新增動作，所以要使用 apiAuth
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
// import menuProducts_dataTable from '../dataTable/menuProducts_dataTable.vue'
import mitt from '@/mitt.js'

// const dataTableRef = ref(null);

// 這是用來調用 DataTableServer 元件的方法，tableLoadItems()
// const reloadTable = () => {
//   if (dataTableRef.value) {
//     dataTableRef.value.tableLoadItems(true);
//   }
// };

// 你可以在需要的時候調用 reloadTable
// onMounted(() => {
//   reloadTable();
// });


// 0716/ 01:57:20
// 將開關狀態寫成一個 data
// 0716/ 05:15:55 判斷 id 為建立、編輯的方式講解
// 因為如果在編輯就要記錄在編輯的商品 id
const dialog = reactive({
  // v-dialog v-model="dialog.open" 綁定預設為 false 關閉狀態
  // 編輯對話框的狀態，預設為關閉狀態
  open: false,
  // 使用 id 來判斷表單是新增(不會有 id)
  // 編輯會有 id，紀錄編輯中的 id
  id: '',
  name: '',
  price: '',
  description: '',
  category: '',
  sell: false
})

// 記得 useApi()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
// fillAgent 上傳圖片套件
const fileAgent = ref(null)

// 定義對話框打開的方法
// const open = (item) => {
//   console.log(item)
//   dialog.name = item.name;
// };

// 使用 defineExpose 來暴露 openDialogMenu 方法
// defineExpose({
//   dialog,
//   open
// });

// categories 分類
const categories = ['炒飯 | Fried Rice', '炒麵 | Fried Noodles', '湯麵 | Soup Noodles','炒米粉 | Fried Vermicelli', '湯米粉 | Soup Vermicelli', '湯品 | Soup', '小品 | Dishes','新品上市']
// yup 欄位驗證
const schema = yup.object({
  name: yup
    .string()
    .required('餐點名稱必填'),
  price: yup
    .number()
    .typeError('餐點價格格式錯誤')
    .required('餐點價格必填')
    .min(0, '商品價格不能小於 0'),
  description: yup
    .string()
    .required('餐點說明項目必填'),
  category: yup
    .string()
    .required('餐點分類必填')
    .test('isCategory', '餐點分類錯誤', value => {
      return categories.includes(value)
    }),
  sell: yup
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
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: true
  }
})

// 先使用 useForm 來綁定表單 ，再使用 useField 來綁定欄位
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')

// 0716/ 02:50:35
// vue-file-agent 的上傳圖片套件，這裡要設定設定兩個陣列
const fileRecords = ref([])
const rawFileRecords = ref([])

// open dialog 的方法要使用 defineExpose 來暴露給父組件使用
const open = (item) => {
  console.log(item)
  dialog.open = true
  // if (item) {
  //   dialog.id = item.id
  //   name.value = item.name
  //   price.value = item.price
  //   description.value = item.description
  //   category.value = item.category
  //   sell.value = item.sell
  // }
}

// 0716/ 03:38:25 取消 @click="closeDialog"
  const closeDialog = () => {
    // 關閉表單
    dialog.open = false
    // 清空表單: resetForm() 從 useForm 回傳的物件方法，會把表單變回 initialValues 的狀態
    resetForm()
    // 0716/ 03:40:10 清空圖要自己做，不在 resetForm() 範圍內
    // vue-file-agent 的清空方法: deleteFileRecord()，因為直接寫陣列清空會有問題。
    // 很重要! 要呼叫 function 的話、要抓取頁面上的東西，一定要先給 ref 等於甚麼，再到下面建立一個同名的 ref
    // ref="fileAgent"，這樣才能使用 fileAgent.value.deleteFileRecord()
    fileAgent.value.deleteFileRecord()
  }

// 定義 submit 方法
// 07/16 03:01:35 
// 執行  @submit.prevent="submit"，然後去寫送出的方法 submit，
// 並執行 useForm 的 handleSubmit 驗證
const submit = handleSubmit(async (values) => {
  // 0716/ 03:02:30 看為甚麼是 fileRecords 
  // 這裡要注意不會幫我們驗證 vue-file-agent 的圖片上傳 (fileRecords)，要自己寫驗證
  // 03:00:40 
  // 在 fileRecords 裡面有 error，所以如果 error 是 false 代表有東西
  // 如果 fileRecords 的 value 第一個檔案有 error 就 return，
  // fileRecords 的 value [0]，代表 vue-file-agent 選到的第一個檔案，
  // 如果沒有選擇檔案的時候， value 會變成 undefined，也會 return。

  // // 0716/ 03:42:39 發現問題沒寫 if(...){...} 會沒有擋到
  if (fileRecords.value[0]?.error) return
  // 0716/ 03:46:41
  // 0716/ 05:17:00 修改送出資料的地方，
  // 因為在編輯是可以不帶檔案的，所以就不需要 fileRecords.value.length < 1 的條件(不能不帶檔案)
  // 如果沒有 id (dialog.value.id.length === 0) 代表是新增，就需要 fileRecords.value.length < 1 這個條件
  // 如果沒有 id (建立) 但沒有圖片就 return
  if (dialog.id.length === 0 && fileRecords.value.length < 1) return
  // 03:07:45
  // try catch要寫 "新增的東西"，因為要送圖片所以使用 FormData()
  try {
    const fd = new FormData()
    // 0716/ 03:07:52 類似 postman 送出資料的方式(new FormData())
    // 之前寫 "註冊、登入" 的 submit 是使用 json 的格式，將檔案送出
    // fd.append(key, value)
    // 建立 new FormData，使用 formData.append(key, value) 來新增欄位
    // key 就是後端要接收的欄位名稱，value 就是要送出的值
    // values.name 是你要提交的值，也就是 values 物件中的 name 屬性
    fd.append('name', values.name)
    fd.append('price', values.price)
    fd.append('description', values.description)
    fd.append('category', values.category)
    fd.append('sell', values.sell)

    // 0716/ 03:09:55
    // 下面這段是圖片上傳的部分 fd.append('image', fileRecords.value[0].file) 
    // fileRecords.value[0].file - 代表放入圖片的位置
    // 如果有上傳圖片，會出現在 fileRecords.value[0].file 
    // file 是一個檔案的物件，代表檔案資料的位置

    // 0716/ 05:18:45 這裡也要加上判斷，如果 >0 才要把檔案圖片放進去(建立)
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    // 03:11:15 如果輸入欄位為新增動作 dialog.value.id === ''
    if (dialog.id === '') {
      // 03:11:25 執行驗證身分完後 .post('/product', fd) 送出資料
      // 注意 '/product' 億澳去對應 back/index.js 路由的名稱
      // 這裡做完可以測試資料有沒有傳入後端
      // 03:36:20 開始做新增後的關閉 @click="closeDialog()"，關閉對話框，停用送出按鈕
      // 先去加 :loading: "isSubmitting"，送出資料時會變成 loading 狀態，包含 v-btn、v-form(綁定 :disabled="isSubmitting")
      // 注意 isSubmitting 是 useForm 回傳的物件方法
      await apiAuth.post('/product', fd)
      // else 為編輯動作，寫完新增再回來寫編輯
    } else {
      // 0716/ 05:18:10
      // 加上 patch 編輯的路由，並且帶入 id，加上 dialog.value.id，在把 fd 表格資料送出去
      await apiAuth.patch('/product/' + dialog.id, fd)
    }
    // 使用 snackbar 提示訊息
    createSnackbar({
      // 0716/ 05:19:10 修改 dialog.value.id === '' ? '新增成功' : '編輯成功',
      text: dialog.id === '' ? '新增成功' : '編輯成功',
      snackbarProps: {
        color: '#D78A24'
      }
    })
    // 0716/ 03:44:50
    // 新增成功就關閉 dialog closeDialog()
    closeDialog()
    // 0716/ 05:01:00
    // 前面已經把表格重新載入的方法寫好，所以在關閉之前獲知後補上 tableLoadItems(true)，重新載入表格資料
    // 補在這裡代表，在關閉對話框後，重新載入表格資料

    // 0716/ 05:01:48 
    // 以上完成到重新載入表格處理完以後，去寫 back/controllers/product.js 的 edit 編輯方法
    // 修改成 reloadTable
    // reloadTable(true)
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

// 打開 dialog 的方法，因為在新增狀態的 id 是空的，所以要判斷 item 是否為空
// 反著寫比較好寫 !=
mitt.on('openMenuDialog', (item) => {
  if (item != null) {
  // 為甚麼 item 是 null
    console.log('on', item)
    dialog.id = item._id
    name.value.value = item.name
    price.value.value = item.price
    description.value.value = item.description
    category.value.value = item.category
    sell.value.value = item.sell
  }
  dialog.open = true
})


// 讓父組件可以使用 open 方法打開 dialog
defineExpose({
  dialog,
  open
})

</script>