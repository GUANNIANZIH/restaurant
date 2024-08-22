<template>
  <v-container fluid class="m-0 p-0 my-v-container">
    <!-- 大 banner -->
    <v-carousel
    height>
      <v-carousel-item
        src="@/assets/banner/member.png"
        cover
      ></v-carousel-item>

      <v-carousel-item
      src="@/assets/banner/大banner-design02.png"
      ></v-carousel-item>

      <v-carousel-item
        src="@/assets/banner/member02.png"
        cover
      ></v-carousel-item>

      <v-carousel-item
        src="@/assets/banner/大banner-design00.png"
        cover
      ></v-carousel-item>
    </v-carousel>

    <!-- banner 視差 -->
    <brandConcept />

    <!-- 消息連結區 -->
    <v-sheet
    class="mx-auto mb-5 w-100 p-5 text-center"
  >
      <br>
      <h2 class="text-h5">News | 最新消息</h2>
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
          :key="newsCard.id"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <newsCard v-bind="newsCard"/>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>

    <sectionPart />
  </v-container>




</template>

<script setup>
import { ref, computed } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
import { useDisplay } from 'vuetify'
// 取資料要把 API 方法拉進去
import { useApi } from '@/composables/axios.js'
import { useSnackbar } from 'vuetify-use-dialog'
// 引入各個元件
import newsCard from '@/components/card/newsCard.vue';
import brandConcept from '@/components/brandConcept.vue';
import sectionPart from '@/components/sectionPart.vue';

definePage({
  name: 'News',
  meta: {
    title: 'NEWS',
    login: false,
    admin: false
  }
})

// 使用 useDisplay 來檢查當前設備的顯示屬性
// const { breakpoint } = useDisplay();
// const length = ref(5);
// const onboarding = ref(0);
const model = ref(null);
// 取資料用的 api
const { api } = useApi();
// snackbar
const createSnackbar = useSnackbar()
// 消息卡片陣列
const newsCards = ref([])

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

<style scoped lang="scss">
html, body, #app{
height: 100%;
margin: 0;
padding: 0;
}

.my-v-container{
padding: 0;
margin: 0px;
}
</style>