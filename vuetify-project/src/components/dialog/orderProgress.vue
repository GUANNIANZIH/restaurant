<template>
  <v-dialog
  v-model="dialogStore.isOpen"
  scrollable
  persistent
  max-width="580">
        <v-sheet class="text-center justify-center">
          <v-card-text>
            <!-- <pre>{{ orders }}</pre> -->
            <!-- <pre>{{ order }}</pre> -->
            <div
            class="text-h5 bg-g"
            >目前餐點進度 Order-Progress</div>
            <!-- 綁定訂單狀態 -->
            <div v-for="(order, index) in orders" :key="index">
              <p>訂單 {{ index + 1 }}</p>
              <p>顧客 {{ order.user.account }}</p>
              <p>狀態: {{ order.status }}</p>
              <v-divider></v-divider>
            </div>
          </v-card-text>
          <v-card-actions
          class="text-center justify-center"
          >
              <v-btn class="bg-y " @click="dialogStore.closeDialog" hover>關閉視窗</v-btn>
          </v-card-actions>
        </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 03:06:48 把資料送出去所以要引入 useApi，去跟 API 做通溝，記得 const useApi
// 因為要做新增商品，要登入才可以做新增動作，所以要使用 apiAuth
import { useApi } from '@/composables/axios'
import { useDialogStore } from '@/stores/dialog.js'
import { useSnackbar } from 'vuetify-use-dialog'
import { io } from 'socket.io-client';

// 初始化 API 和 Dialog Store
const { apiAuth } = useApi()
const dialogStore = useDialogStore()
const createSnackbar = useSnackbar()

// 使用 orders 來存儲所有訂單
const orders = ref([]);

// 這裡是要取得訂單狀態，所以要有一個 orderStatue
const orderStatus = ref('pending')

// 初始化 Socket.IO 連接
const socket = io(import.meta.env.VITE_API); // 確保這個 URL 是您的後端服務器

socket.on('connect', () => {
  console.log('Connected to server');
});

// 當元件掛載時，啟動 socket.io 連接並監聽訂單狀態更新
onMounted(() => {
  socket.on('orderStatusUpdated', (data) => {
    // 更新特定訂單的狀態
    const order = orders.value.find(order => order._id === data.orderId);
    if (order) {
      order.status = data.status;
    }
  });
});

// loadItems 取得店家回傳的訂單狀態
const loadItems = async () => {
  try {
    // apiAuth.get
    // router.get('/cart', auth.jwt, getCart) 取得購物車
    const { data } = await apiAuth.get('/order/all')
    // 確認 data 是否有拿到資料
    console.log('data', data)
    orders.value = data.result || [];
    // 根據需要處理返回的數據，這裡假設你需要獲取訂單狀態
    // data.result.orderStatus: 這是從伺服器返回的數據 data 中提取的 orderStatus 欄位。
    // 這個欄位通常是用來描述訂單的當前狀態，比如 'processing'、'completed' 或 'cancelled' 等等。
    // 當 data.result.orderStatus 是 undefined、null、false、0、NaN 或空字符串（即 JavaScript 中的 "falsy" 值）時，會返回 'pending' 作為預設值。
    orderStatus.value = data.result.status || 'pending'
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

</script>

<style scoped>
.bg-y{
  color: white;
  background-color: #D78A24;
}
.bg-g{
  color: white;
  background-color: #3C5D44;
  padding: 16px;
}
div.v-card-text{
  padding: 0px;
}
</style>