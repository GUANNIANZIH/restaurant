<template>
<v-container fluid class="my-v-container">

  <!-- 大 banner -->
  <v-responsive class="carousel-container align-center">
    <!-- logo -->
    <div>
      <v-img 
      src="@/assets/logo/logo-web-navHome-text-dark.png"
      class="my-logo mb-5 mt-5">
      </v-img>
    </div>
    <!-- Swiper container -->
    <Swiper
        :modules="[Autoplay]"
        :autoplay="{ delay: 3000 }"
        :loop="true"
        class="mySwiper"
        >
        <!-- Swiper slides -->
        <SwiperSlide v-for="(photo, index) in photos" :key="index">
          <div class="img-container">
            <v-img :src="photo.url" class="w-100 h-100" cover></v-img>
          </div>
        </SwiperSlide>
    </Swiper>
  </v-responsive>

  <!-- 熱門商品、活動、連結 -->
  <v-container class="w-75" fluid>
    <v-row class="my-row" v-for="(photo, index) in rows" :key="index">
      <v-col
      v-for="(item, colIndex) in photo"
      :key="colIndex"
      class="my-col"
      cols="12"
      md="4"
      >
        <router-link :to="item.to">
          <v-hover
            v-slot="{ isHovering, props }"
            >
          <!-- 可以增加 cover 屬性 -->
          <v-img
          :src="item.url" 
          class="my-img mx-auto"
          v-bind="props"
          cover>
            <v-expand-transition>
              <div
                v-if="isHovering"
                class="d-flex transition-fast-in-fast-out bg-accent text-overlay w-100"
              >
                <div class="mx-5  text-body-1">
                    {{ item.title }}
                    <br>
                    {{ item.subtitle }}
                </div>
              </div>
            </v-expand-transition>
          </v-img>
        </v-hover>
        </router-link>
      </v-col>
    </v-row>
  </v-container>

  <!-- banner 視差 -->
  <BrandSection />

  <News />

  <sectionPartComponent />


</v-container>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { ref, computed, onMounted } from 'vue'
// 引入元件
import BrandSection from '@/components/brandSection.vue'

// import brandConceptComponent from '@/components/brandConcept.vue'
import sectionPartComponent from '@/components/sectionPart.vue';
import News from '@/components/news.vue'
// 引入 dialog
// import orderProgress from '@/components/dialog/orderProgress.vue';
// 引入 stores useDialogStore
// import { useDialogStore } from '@/stores/dialog.js'

import AOS from 'aos'
import 'aos/dist/aos.css'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import _ from 'lodash'

onMounted(() => {
  console.log('VITE_API:', import.meta.env.VITE_API)
  
  AOS.init({
    once: true
  })
})

definePage({
    meta: {
      title: '玉食堂 | JADE',
      login: false,
      admin: false
    }
})

const photos = ref([
{ url: new URL('@/assets/banner/大banner-design00.png', import.meta.url).href },
{ url: new URL('@/assets/banner/大banner-design02.png', import.meta.url).href },
{ url: new URL('@/assets/banner/大banner-design00.png', import.meta.url).href },
{ url: new URL('@/assets/banner/大banner-design02.png', import.meta.url).href }
])

// newsPhotos *********************************************************************
const newsPhotos = ref([
{
  url: new URL('@/assets/card-products/烏梅汁.png', import.meta.url).href,
  title: 'NEWS',
  subtitle: '天然養生烏梅汁正式上市',
  to: '/menu'
},
{
  url: new URL('@/assets/card-products/椒麻滷味-豬耳朵.png', import.meta.url).href,
  title: 'NEWS',
  subtitle: '多款椒麻香滷味正式上市',
  to: '/menu'
},
{
  url: new URL('@/assets/card-products/秘製滷肉飯 (2).png', import.meta.url).href,
  title: 'SPECIALTIES',
  subtitle: '主廚私房菜搶先預購',
  to: '/specialty'
},
{
  url: new URL('@/assets/banner/member02.png', import.meta.url).href,
  title: 'SPECIALTIES',
  subtitle: '森林會員特區',
  to: '/member'
},
{
  url: new URL('@/assets/banner/店休公告.jpg', import.meta.url).href,
  title: 'ACTIVITY',
  subtitle: '店內公休公告',
  to: '/news'
},
{
  url: new URL('@/assets/persons/台灣意象炒飯炒麵小吃店工作生活照_新.jpg', import.meta.url).href,
  title: 'STORY',
  subtitle: '玉石堂品牌故事',
  to: '/about'
}
])

console.log(newsPhotos.value.map(photo => photo.url))

// 使用 'lodash' 套件
const rows = computed(() => {
return _.chunk(newsPhotos.value, 3)
})

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

.carousel-container{
  position: relative;
}

.img-container {
  overflow: hidden;
  z-index: -1;
}

.my-logo{
  height: 100px;
}

.my-row {
margin: 16px;
padding: 0;
}

.my-col {
padding: 0;
margin: 0;
position: relative;
z-index: 1;
}


.my-img {
height: 200px;
display: flex;
flex-direction:row;
justify-content:flex-end;
align-items:end;
position: relative;
z-index: 1;
color: rgba(255, 255, 255, 1) !important;
}

.text-overlay {
position: absolute;
bottom: 0px;
left: 0px;
color: white;
z-index: 3;
}

.bg-accent {
  background-color: #D78A24;
}

</style>
