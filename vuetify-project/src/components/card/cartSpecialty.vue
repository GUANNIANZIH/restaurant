<template>
    <v-card>
      <v-sheet cols="12" class="ma-5 text-center">
        <h2 class="text-center">我的預購私廚購物車</h2>
      </v-sheet>
      <v-data-table :items="items" :headers="headers">
        <template #[`item.p_id.name`]="{item}">
          <span v-if="item.p_id.sell">{{ item.p_id.name }}</span>
          <span v-else class="text-red">{{ item.p_id.name }} (已下架)</span>
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
      <v-btn color="#3C5D44" :disabled="!canCheckout" @click="checkoutSpecialty">結帳</v-btn>
    </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/axios.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

// items 陣列存取購物車的商品
const items = ref([])

const headers = [
  { title: '品名', key: 'p_id.name' },
  { title: '單價', key: 'p_id.price' },
  { title: '數量', key: 'quantity' },
  { title: '總價', key: 'total', 
  value: item => item.p_id.price * item.quantity },
  { title: '操作', key: 'action' }
]

// loadItems 取得購物車商品
const loadItems = async () => {
  try {
    // apiAuth.get
    // router.get('/cart', auth.jwt, getCart) 取得購物車
    const { data } = await apiAuth.get('/user/cartSpecialty')
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

const total = computed(() => {
  return items.value.reduce((total, current) => {
    return total + current.quantity * current.p_id.price
  }, 0)
})

const canCheckout = computed(() => {
  return items.value.length > 0 && !items.value.some(item => !item.p_id.sell)
})

const loading = ref(false)

const checkoutSpecialty = async () => {
  loading.value = true
  const result = await user.checkoutSpecialty()
  createSnackbar({
    text: result.text,
    snackbarProps: {
        color: result.color
      }
  })
  if (result.color === '#3C5D44') {
    router.push('/')
  }
  loading.value = false
}

const addCart = async (product, quantity) => {
  const result = await user.addSpecialtyCart(product, quantity)
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

// const updateUserSpentAndPoints = async () => {
//   try {
//     await apiAuth.post('/user/calculate-totalSpent')
//     await apiAuth.post('/user/convert-to-points')
//     // 更新使用者資料
//     await user.profile()
//     // 更新狀態管理中的 totalSpent 和 totalPoints
//     totalSpent.value = user.totalSpent
//     totalPoint.value = user.totalPoints
//   } catch (error) {
//     console.log(error)
//     console.error('更新使用者累積消費、累積點數失敗', error)
//   }
// }

onMounted( () => {
  loadItems()
//   updateUserSpentAndPoints()
})


</script>