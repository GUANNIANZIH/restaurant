<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center text-cus">即時點餐訂單管理</h1>
      </v-col>
      <v-divider></v-divider>

      <v-col cols="12" class="h-75">
        <!-- :items="items" 綁定到表格中的資料源，items 代表你從後端或其他地方取得的資料 -->
        <!-- :headers="headers" 是綁定到表格的標題設定，這裡的 headers 代表表格的欄位配置 -->
        <!-- 改成自定義的排序 :items="sortedItems" -->
        <!-- 原本是 :items="items" -->
        <v-data-table
          :items="sortedItems"
          :headers="headers"
          :items-per-page="4"
          :items-per-page-options="[4, 8, 12]"
        >
        <!-- 顯示使用者購物車資訊 -->
        <!-- <template #[item.cart]="data"> 用來指定 cart 欄位的顯示模板。
              data 是這一行的資料對象。 -->
          <template #[`item.cart`]="data">
            <ul>
              <li v-for="item in data.item.cart" :key="item._id">
                {{ item.p_id.name }} * {{ item.quantity }}
                <!-- <pre>{{ item }}</pre> -->
                <!-- 新增客製化口味顯示 -->
                <!-- 影響顯示方式所以拿掉 : {{ item.customizations['加蛋 +15'] }} -->
                <!-- <ul>
                  <li v-if="item.customizations['加辣']">辣度: {{ item.customizations['加辣'] }}</li>
                  <li v-if="item.customizations['加蛋 +15'] === 'true'">加蛋 +15</li>
                  <li v-if="item.customizations['加飯 +15'] === 'true'">加飯 +15</li>
                  <li v-if="item.customizations['加沙茶 +15'] === 'true'">加沙茶 +15</li>
                  <li v-if="item.customizations['加料 +45'] === 'true'">加料 +45</li>
                </ul> -->
              </li>
            </ul>
          </template>
          <template #[`item.customized`]="data">
            <ul>
              <li v-for="item in data.item.cart" :key="item._id">
                <ul v-if="Object.keys(item.customizations).length">
                  <li v-if="item.customizations['加辣']">辣度: {{ item.customizations['加辣'] }}</li>
                  <li v-if="item.customizations['加蛋 +15'] === 'true'">加蛋 +15</li>
                  <li v-if="item.customizations['加飯 +15'] === 'true'">加飯 +15</li>
                  <li v-if="item.customizations['加沙茶 +15'] === 'true'">加沙茶 +15</li>
                  <li v-if="item.customizations['加料 +45'] === 'true'">加料 +45</li>
                </ul>
                <span v-else>無</span>
              </li>
            </ul>
          </template>
          <!-- 綁定按鈕送出訂單狀態 'in-processing', 'completed' -->
          <template v-slot:item.status="{ item }">
            <div>
              <v-btn 
                v-for="status in ['in-process', 'completed']"
                :key="status"
                @click="changeStatus(item, status)"
                class="mt-2 mb-2 w-75 bg-dark"
                :disabled="isDisabled(item.status)"
              >
                {{ status }}
              </v-btn>
              <!-- 取消訂單狀態 -->
              <v-btn 
              title="canceled" 
              @click="canceled(item)"
              class="mt-2 mb-2 w-75 bg-er"
              :disabled="isDisabled(item.status)"
              >canceled</v-btn>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
// api 用來取得資料
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'

definePage({
  meta: {
    title: '玉食堂 | 即時點餐訂單管理',
    login: true,
    admin: true
  }
})

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
// items 陣列存取所有訂單
const items = ref([])
const headers = [
  { title: '訂單編號', key: '_id' },
  { title: '會員帳號', key: 'user.account' },
  { title: '下單日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
  { title: '訂單商品', key: 'cart', sortable: false},
  { title: '客製化需求', key: 'customized', sortable: false},
  {
    title: '訂單金額',
    key: 'price',
    // 使用 value 去計算總價，.reduce() 累加動作，會有兩個參數 total, current
    // total 是累加的結果，current 是當前的項目
    value: item => {
      return item.cart.reduce((total, current) => {
        return total + current.quantity * current.p_id.price
      }, 0)
    }
  },
  { title: '訂單狀態', key: 'status', sortable: false },
]

// 取得所有訂單
const loadItems = async () => {
  try {
    // apiAuth.get('/order/all') 取得所有訂單
    const { data } = await apiAuth.get('/order/all')
    // items 陣列存取所有訂單
    // data 是上面的 { data } 解構出來的
    // ...data.result 是將 data.result 的內容展開
    items.value.push(...data.result)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
loadItems()

const changeStatus = async (item, status) => {
  try {
    console.log(apiAuth.defaults);
    console.log({ _id: item._id, status });
    console.log("Changing status to:", status); // 代表更新後的 status
    console.log(item._id); // 代表訂單的 id 編號
    console.log(item.status) // 更新前的 status
    // router.patch('/all', auth.jwt, admin, updateStatus)
    // { _id: item._id, status } 代表請求的內容，要送到伺服器進行訂單更新的動作
    const { data } = await apiAuth.patch('/order/all', { _id: item._id, status });
    createSnackbar({
      text: data.message,
      snackbarProps: {
        color: '#3C5D44'
      }
    });
    loadItems();
  } catch (error) {
    console.log(error);
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    });
  }
};

// 取消訂單狀態
const canceled = async (item) => {
  await changeStatus(item, 'canceled');
};

// 使用 computed 來判斷按鈕是否需要禁用
const isDisabled = (status) => {
  return ['completed', 'canceled'].includes(status);
};

// 自定義排序函數
// computed 來生成排序過的 items 列表 :
// 排序依據是 statusOrder 中的順序：pending、in-process 狀態的訂單會排在前面，completed 和 canceled 排在後面。
const sortedItems = computed(() => {
  return items.value.slice().sort((a, b) => {
    const statusOrder = ['in-process', 'completed', 'canceled', 'canceled'];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  })
})

</script>

<style scoped>
  .bg-dark{
    background-color: #3C5D44;
    color: white;
  }
  .bg-er{
    background-color: #D66425;
    color: white;
  }
  .text-cus{
    color: #2C3E31;
    font-weight: bold;
  }
  .v-data-table{
    height: 75vh;
  }
  :deep(.v-data-table-header__content) {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
  }
  span{
    text-align: center;
  }
</style>

<route lang="yaml">
meta:
  layout: admin
</route>

退出 (ESC)
content once I found out that this is possible without a plug-in in elements I 
內容一旦我發現這在元素中沒有外掛程式是可能的 I
00:13
00:11
