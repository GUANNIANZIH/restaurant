<template>
<v-container>
  <v-row>
    <v-col cols="12">
      <h1 class="text-center text-cus">玉食堂營收登記</h1>
    </v-col>
    <v-col cols="12">
      <v-btn color="#3C5D44" @click="openDialog(null)">新增營收項目</v-btn>
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
      <v-card-title>{{ dialog.id ? '編輯營收項目' : '新增營收項目' }}</v-card-title>
      <v-card-text>
        <v-text-field
          label="登記項目名稱"
          v-model="itemName.value.value"
          :error-messages="itemName.errorMessage.value"
        ></v-text-field>
        <v-text-field
          label="交易日期"
          type="date"
          v-model="date.value.value"
          :error-messages="date.errorMessage.value"
        ></v-text-field>
        <v-text-field
          label="進貨數量"
          type="number"
          v-model="quantity.value.value"
          :error-messages="quantity.errorMessage.value"
        ></v-text-field>
        <!-- <v-text-field
          label="價格"
          type="number"
          min="1"
          v-model="price.value.value"
          :error-messages="price.errorMessage.value"
        ></v-text-field> -->
        <v-select
          label="交易類型"
          :items="transactionTypes"
          item-title="text"
          item-value="value"
          v-model="typeField.value.value"
          :error-messages="typeField.errorMessage.value"
        ></v-select>
        <v-text-field
          label="總金額"
          type="number"
          v-model="totalAmount.value.value"
          :error-messages="totalAmount.errorMessage.value"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" :loading="isSubmitting" @click="closeDialog">取消</v-btn>
        <v-btn color="green" type="submit" :loading="isSubmitting">送出</v-btn>
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
    title: '玉食堂 | 營收管理',
    login: true,
    admin: true
  }
})

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const dialog = ref({
  // 編輯對話框的狀態
  open: false,
  // 紀錄編輯中的 id，沒有就是新增，有就是編輯
  id: ''
})

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    itemName.value.value = item.itemName
    date.value.value = item.date
    quantity.value.value = item.quantity
    typeField.value.value = item.typeField
    totalAmount.value.value = item.totalAmount
  } else {
    dialog.value.id = ''
  }
  dialog.value.open = true
}

const closeDialog = () => {
  dialog.value.open = false
  resetForm()
}

const transactionTypes = [
  { text: '當日營業額收入', value: '當日營業額收入' },
  { text: '當日進貨支出', value: '當日進貨支出' },
  { text: '當日其他支出', value: '當日其他支出' },
  { text: '當日其他收入', value: '當日其他收入' },
  { text: '當日開店本金', value: '當日開店本金' }
]

const schema = yup.object({
  itemName: yup
    .string()
    .required('登記項目名稱必填'),
    date: yup
    .date()
    .required('交易日期必填'),
  quantity: yup
    .number()
    .min(1, '商品數量不得小於1')
    .required('項目數量必填'),
  // price: yup
  //   .number()
  //   .min(1, '商品價格不得小於1')
  //   .required('商品價格必填'),
  typeField: yup
    .string()
    // .oneOf 代表只能是陣列裡面的其中一個值
    .oneOf(transactionTypes.map((typeField) => typeField.value), '交易類型必填'),
  totalAmount: yup
    .number()
    .test('valid-amount', '總金額錯誤', function (value) {
      const { typeField } = this.parent
      if (['REVENUE', 'OTHER_INCOME'].includes(typeField)) {
        return value >= 0;
      } else if (['PURCHASE_EXPENSE', 'OTHER_EXPENSE', 'INITIAL_CAPITAL'].includes(typeField)) {
        return value <= 0;
      }
      return true;
    })
    .required('總金額必填')
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  // 設定初始值 :
  // price: 0,
  initialValues: {
    itemName: '',
    date: '',
    quantity: 0,
    typeField: '',
    totalAmount: 0
  }
})

const itemName = useField('itemName')
const date = useField('date')
const quantity = useField('quantity')
// const price = useField('price')
const typeField = useField('typeField')
const totalAmount = useField('totalAmount')

// submit function
const submit = handleSubmit(async (values) => {
  try {
    // 根據表單的狀態（新增或編輯）來決定是向後端發送 POST 請求還是 PATCH 請求
    // 如果 dialog.value.id 存在，表示正在編輯現有的營收項目，否則表示正在創建一個新的營收項目。
    if (dialog.value.id === '') {
    // 如果是新增，使用 POST 請求，並傳送表單資料到後端的 '/revenue'
    await apiAuth.post('/revenue', values)
    } else {
    // 如果是編輯，使用 PATCH 請求，並附上需要編輯的項目 ID
    await apiAuth.patch('/revenue/' + dialog.value.id , values)
  }
  createSnackbar({
    text: dialog.value.id === '' ? '新增成功' : '編輯成功',
    snackbarProps: {
      color: '#D78A24'
    }
  })
    closeDialog()
    tableLoadItems(true)
  } catch (error) {
    createSnackbar({ text: error.response?.data.message || '發生錯誤', color: 'error' })
  }
})

// deleteItem function
const deleteItem = async (item) => {
  try {
    await apiAuth.delete(`/revenue/${item._id}`)
    createSnackbar({ text: '營收項目已刪除', color: 'success' })
    tableLoadItems(true)
  } catch (error) {
    createSnackbar({ text: error.response?.data.message || '刪除失敗', color: 'error' })
  }
}

const tableItemsPerPage = ref()
const tableSortBy = ref([{ key: 'date', order: 'desc' }])
const tablePage = ref(1)
const tableItems = ref([])
const tableItemsLength = ref(0)
const tableLoading = ref(false)
const tableSearch = ref('')

const tableHeaders = [
  { title: '登記項目名稱', align: 'center', sortable: false, key: 'itemName' },
  { title: '交易日期', align: 'center', sortable: true, key: 'date' ,value: item => new Date(item.createdAt).toLocaleString() },
  { title: '進貨數量', align: 'center', sortable: true, key: 'quantity' },
  // { title: '價格', align: 'center', sortable: true, key: 'price' },
  { title: '交易類型', align: 'center', sortable: true, key: 'typeField' },
  { title: '總金額', align: 'center', sortable: true, key: 'totalAmount' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const tableLoadItems = async (reset) => {
  console.log('Function executed')
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/revenue/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'date',
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value
      }
    })
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
  tableLoading.value = false
}
tableLoadItems()
</script>

<style scoped>
    .text-cus{
    color: #2C3E31;
    font-weight: bold;
    }
</style>

<route lang="yaml">
meta:
  layout: admin
</route>