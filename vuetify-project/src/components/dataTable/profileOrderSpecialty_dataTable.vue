<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2 class="text-center">我的私廚訂單查詢</h2>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12">
                <!-- <data-table-server :items="orderHistory" /> -->
                <!-- 0717 02:49:00 綁定 items、headers -->
                <v-data-table :items="items" :headers="headers">
                    <!-- 0717 04:02:10 -->
                    <!-- template 加上插槽 slot 顯示正確資訊 -->
                    <template #[`item.cartSpecialties`]="data">
                    <ul>
                      <!-- 跑 v-for，data.item.cart 購物車裡面所有的 item，綁定 item._id -->
                      <li v-for="item in data.item.cartSpecialties" :key="item._id">
                      <!-- 計算總價 -->
                        {{ item.p_id.name }} * {{ item.quantity }}
                      </li>
                    </ul>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useApi } from '@/composables/axios'
  import { useUserStore } from '@/stores/user'
  import { useSnackbar } from 'vuetify-use-dialog'
  
  const { apiAuth } = useApi()
  const createSnackbar = useSnackbar()
  const user = useUserStore()
  
  const items = ref([])
  const headers = [
    { title: '編號', key: '_id' },
    { title: '日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '商品', key: 'cartSpecialties', sortable: false },
    {
      title: '金額',
      key: 'price',
      value: item => {
        return item.cartSpecialties.reduce((total, current) => {
          return total + current.quantity * current.p_id.price
        }, 0)
      }
    }
  ]
  
  const loadItems = async () => {
    try {
      const { data } = await apiAuth.get('/order/specialty')
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
  </script>