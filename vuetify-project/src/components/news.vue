<template>
  <v-container fluid class="m-0 p-0 my-v-container">
    <!-- 消息連結區 -->
    <v-sheet
    class="mx-auto mb-5 w-100 p-5 text-center"
  >
    <br>
    <h2 class="text-h5">玉食堂最新消息</h2>

      <v-slide-group
        v-model="model"
        class="pa-4"
        show-arrows
      >
        <v-slide-group-item
          v-for="item in NewsCardComponents"
          :key="item._id"
          >
            <NewsCardComponent v-bind="item"/>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-container>
</template>

<script setup>
// 取資料要把 API 方法拉進去
import { useApi } from '@/composables/axios.js'
import { useSnackbar } from 'vuetify-use-dialog'
import NewsCardComponent from '@/components/card/newsCard.vue';

// model 變數，綁定 v-model
const model = ref('')
// 消息卡片陣列
const NewsCardComponents = ref([])
// 取資料用的 api
const { api } = useApi();
// snackbar
const createSnackbar = useSnackbar()

// 0717/ 00:32:45 取商品的方法
const loadNewsCardComponents = async () => {
  try {
    const { data } = await api.get('/news', {})
    console.log(data)
    NewsCardComponents.value.splice(0, NewsCardComponents.value.length, ...data.result.data)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '無法載入活動資料',
      snackbarProps: {
        color: '#D78A24'
      }
    })
  }
}
loadNewsCardComponents()
</script>