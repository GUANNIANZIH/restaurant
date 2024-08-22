<template>
  <v-dialog v-model="dialog.open" persistent width="500">
      <v-form @submit.prevent="submit" :disabled="isSubmitting">
        <v-card>
          <v-card-title>{{ dialog.id ? '編輯商品' : '新增商品' }}</v-card-title>
          <v-card-text>
            <v-text-field
              label="名稱"
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
            ></v-text-field>
            <v-text-field
              label="價格"
              type="number" min="0"
              v-model="price.value.value"
              :error-messages="price.errorMessage.value"
            ></v-text-field>
            <v-select
              label="分類"
              :items="categories"
              v-model="category.value.value"
              :error-messages="category.errorMessage.value"
            ></v-select>
            <v-checkbox
              label="產品上市"
              v-model="sell.value.value"
              :error-messages="sell.errorMessage.value"
            ></v-checkbox>
            <v-textarea
              label="餐點描述"
              v-model="description.value.value"
              :error-messages="description.errorMessage.value"
            ></v-textarea>
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

          <v-card-actions>
            <v-btn color="red" :loading="isSubmitting" @click="closeDialog">取消</v-btn>
            <!-- 送出 type="submit" -->
            <v-btn color="green" type="submit" :loading="isSubmitting">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
  </v-dialog>

  <!-- <specialtyProducts_dataTable ref="dataTableRef" v-show="false"/> -->
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
  import mitt from '@/mitt.js'

  // import specialtyProducts_dataTable from '../dataTable/specialtyProducts_dataTable.vue'

  // const dataTableRef = ref(null);

  // 這是用來調用 DataTableServer 元件的方法，tableLoadItems()
  // const reloadTable = () => {
  //   if (dataTableRef.value) {
  //     dataTableRef.value.tableLoadItems(true);
  //   }
  // };

  // // 你可以在需要的時候調用 reloadTable
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
  
  // categories 分類
  const categories = ['料理包預購 | MealKit Pre-order', '私廚預購 | Chef Pre-order']
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
  
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  // 定義對話框打開的方法
  const open = (item) => {
    dialog.open = true
    if (item) {
      dialog.id = item.id
      name.value = item.name
      price.value = item.price
      description.value = item.description
      category.value = item.category
      sell.value = item.sell
    }
  }
  
  // 0716/ 03:38:25 取消 @click="closeDialog"
  const closeDialog = () => {
    // 關閉表單
    dialog.open = false
    // 清空表單: resetForm() 從 useForm 回傳的物件方法，會把表單變回 initialValues 的狀態
    resetForm()
    fileAgent.value.deleteFileRecord()
  }
  
  const submit = handleSubmit(async (values) => {
    if (fileRecords.value[0]?.error) return
    if (dialog.id.length === 0 && fileRecords.value.length < 1) return
    // 03:07:45
    // try catch要寫 "新增的東西"，因為要送圖片所以使用 FormData()
    try {
      const fd = new FormData()
      fd.append('name', values.name)
      fd.append('price', values.price)
      fd.append('description', values.description)
      fd.append('category', values.category)
      fd.append('sell', values.sell)

      // 0716/ 05:18:45 這裡也要加上判斷，如果 >0 才要把檔案圖片放進去(建立)
      if (fileRecords.value.length > 0) {
        fd.append('image', fileRecords.value[0].file)
      }
  
      // 03:11:15 如果輸入欄位為新增動作 dialog.value.id === ''
      if (dialog.id === '') {
        await apiAuth.post('/specialty', fd)
        // else 為編輯動作，寫完新增再回來寫編輯
      } else {
        // 0716/ 05:18:10
        // 加上 patch 編輯的路由，並且帶入 id，加上 dialog.value.id，在把 fd 表格資料送出去
        await apiAuth.patch('/specialty/' + dialog.id, fd)
      }
      // 使用 snackbar 提示訊息
      createSnackbar({
        // 0716/ 05:19:10 修改 dialog.value.id === '' ? '新增成功' : '編輯成功',
        text: dialog.id === '' ? '新增成功' : '編輯成功',
        snackbarProps: {
          color: '#D78A24'
        }
      })
      // 新增成功就關閉 dialog closeDialog()
      closeDialog()
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

  mitt.on('openSpecialtyDialog', (item) => {
    if (item != null) {
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

  // 使用 defineExpose 來暴露 openDialogMenu 方法
  defineExpose({
    open
  })
  </script>