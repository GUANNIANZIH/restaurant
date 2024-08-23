<template>
  <v-container fluid class="m-0 p-0 my-v-container">
    <!-- 消息連結區 -->
    <v-sheet
    class="mx-auto mb-5 w-100 p-5 text-center"
  >
    <br>
    <h2 class="text-h5">NEWS</h2>
    <pre>loadNewsCards</pre>
    <!-- 顯示一組可以滑動的項目，有選擇功能 -->
    <!-- selected-class="bg-success": 被選中時，設置背景顏色 -->
      <v-slide-group
        v-model="model"
        class="pa-4"
        show-arrows
      >
      <!-- v-for="n in 15": 循環生成 15 個項目 -->
      <!-- v-slot="{ isSelected, toggle, selectedClass }": 
      使用作用域插槽來獲取 v-slide-group-item 的狀態和操作方法 -->
        <v-slide-group-item
            v-for="newsCard in newsCards"
            :key="newsCard"
          >
            <newsCard v-bind="newsCard"/>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-container>
</template>

<script setup>
// 取資料要把 API 方法拉進去
import { useApi } from '@/composables/axios.js'
import { useSnackbar } from 'vuetify-use-dialog'
import newsCard from '@/components/card/newsCard.vue';

// model 變數，綁定 v-model
const model = ref('')
// 消息卡片陣列
const newsCards = ref([])
// 取資料用的 api
const { api } = useApi();
// snackbar
const createSnackbar = useSnackbar()

// 0717/ 00:32:45 取商品的方法
const loadNewsCards = async () => {
  try {
    const { data } = await api.get('/news', {})
    newsCards.value.splice(0, newsCards.value.length, ...data.result.data)
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
loadNewsCards()
</script>