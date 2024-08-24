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
    <BrandSection />

    <!-- 消息連結區 -->
    <v-sheet
    class="mx-auto mb-5 w-100 p-5 text-center"
    >
      <News />
    </v-sheet>

    <sectionPart />
  </v-container>
</template>

<script setup>
// import { ref, computed } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
// import { useDisplay } from 'vuetify'
// 取資料要把 API 方法拉進去
// import { useApi } from '@/composables/axios.js'
// import { useSnackbar } from 'vuetify-use-dialog'
// 引入各個元件
import News from '@/components/news.vue'
import BrandSection from '@/components/brandSection.vue';
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
// const model = ref(null);
// 取資料用的 api
// const { api } = useApi();
// snackbar
// const createSnackbar = useSnackbar()

// 消息卡片陣列
// const newsCardComponents = ref([])

// 0717/ 00:32:45 取商品的方法
// const loadNewsCards = async () => {
//   try {
//     const { data } = await api.get('/news', {})
//     newsCards.value.splice(0, newsCards.value.length, ...data.result.data)
//   } catch (error) {
//     console.log(error)
//     createSnackbar({
//       text: error?.response?.data?.message || '無法載入活動卡片',
//       snackbarProps: {
//         color: 'red'
//       }
//     })
//   }
// }
// loadNewsCards()

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