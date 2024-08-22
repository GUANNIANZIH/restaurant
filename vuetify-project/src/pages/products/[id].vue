<!-- 0717 01:05:40
概念:
如果在 products/[id].vue 裡面打上
{{ $route.params.id }} 代表取得路由的參數，取得商品的 id
假設網址為 localhost:3000/#/products/aaa123
畫面會出現 aaa123。
等於說可以用參數.id "params.id" 去抓到要的東西
$router 代表的是跳頁；$route 代表的是取得路由的參數、取資料
所以現在這裡要取得路由的資訊要使用 $route
-->
<!-- 0717 01:06:45
開始寫商品頁的模板 products/[id].vue
-->
<template>
    <v-container>
    <v-col cols="12">
        <!-- {{ product.name }} -->
        <h1 class="text-center">{{ product.name }}</h1>
    </v-col>
    <v-col cols="12">
        <!-- 注意 v-img 把訂 :src="product.image" -->
        <v-img :src="product.image" height="200"></v-img>
    </v-col>
    <v-col cols="12">
        <p>${{ product.price }}</p>
        <!-- 0717 01:15:12 如果使用 white-space: pre 會導致無法換行 -->
        <p>{{ product.description }}</p>
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
        <v-text-field type="number" v-model.number="quantity.value.value" :error-messages="quantity.errorMessage.value"></v-text-field>
        <v-btn type="submit" prepend-icon="mdi-cart" :loading="isSubmitting">加入購物車</v-btn>
        </v-form>
    </v-col>
    </v-container>
    <!-- 0723/ 00:04:00 因為沒有要做雙向綁定 v-model，所以使用唯獨值 :model-value -->
    <!-- 如果商品下架 :model-value="!product.sell" -->
    <!-- 設定固定 persistent，可以看 props-->
    <v-overlay class="align-center justify-center text-center" :model-value="!product.sell" persistent>
    <h1 class="text-center text-red">已下架</h1>
    <!-- 再做簡單的 v-btn -->
    <v-btn to="/">回首頁</v-btn>
    </v-overlay>
</template>

<script setup>
import { ref } from 'vue'
import { definePage } from 'vue-router/auto'
// 0717 01:09:30
// 引用 useRoute 抓資訊、useRouter
import { useRoute, useRouter } from 'vue-router'
// 發請求 useApi
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: '詳細商品資訊',
    login: false,
    admin: false
  }
})

// 使用 useApi，使用在下面的方法 load 裡面的 api.get
const { api } = useApi()
// 使用 useRoute 這樣才可以使用路由的參數 ('/product/' + route.params.id)
const route = useRoute()
// // 使用 useRoute
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

// 0717 01:07:40
// 使用 ref ([])
// 把商品的所有欄位都寫好，都為空，這樣才可以代入上面的欄位
// 記得 product 使用 ref，所以後面都要加上 .value
const product = ref({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  sell: true, //預設為上架
  category: ''
})

const load = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    // 0717 01:11:25 把上面設定的欄位都代入
    product.value._id = data.result._id
    product.value.name = data.result.name
    product.value.price = data.result.price
    product.value.description = data.result.description
    product.value.image = data.result.image
    product.value.sell = data.result.sell
    product.value.category = data.result.category

    // 0717 01:12:00 改變 definePage 網頁標題 + 商品名稱(product.value.name)
    document.title = '詳細商品資訊 | ' + product.value.name
  } catch (error) {
    console.log(error)
    // 有錯誤的話顯示同樣的錯誤訊息，記得要 use  createSnackbar
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        // 錯誤顏色 color: '#D66425'
        color: '#D66425'
      }
    })
  }
}
load()

const schema = yup.object({
  quantity: yup.number().typeError('數量必填').required('數量必填').min(1, '最少為 1')
})
const { isSubmitting, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    quantity: 1
  }
})
const quantity = useField('quantity')

const submit = handleSubmit(async (values) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  const result = await user.addCart(product.value._id, values.quantity)
  createSnackbar({
    text: result.text,
    snackbarProps: {
      color: result.color
    }
  })
})
</script>
