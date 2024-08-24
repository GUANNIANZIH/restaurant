<template>
  <v-container fluid class="m-0 p-0 my-v-container">
    <AboutBrand />
    <BrandSection />

    <v-row class="my-5 mx-5 mt-5 mb-5 pa-5">
      <v-timeline
      direction="horizontal"
      line-color="#3C5D44"
      line-thickness='3'
      >
        <v-timeline-item
          v-for="(item, i) in items"
          :key="i"
          :dot-color="item.color"
          :icon="item.icon"
          fill-dot
        >
          <v-sheet class="text-center">
            <v-card-title :class="['text-h4', `bg-${item.color}`]">
              {{ item.title }}
            </v-card-title>
            <v-card-text class="bg-white text--primary">
              {{ item.content }}
            </v-card-text>
          </v-sheet>
        </v-timeline-item>
      </v-timeline>
    </v-row>

    <SectionPart />

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
import BrandSection from '@/components/brandSection.vue';
import SectionPart from '@/components/sectionPart.vue';
import AboutBrand from '@/components/aboutBrand.vue';

const items = ref([
{
          color: '#3C5D44',
          icon: 'mdi-ray-start',
          title: '2017',
          content: '玉食堂成立',
        },
        {
          color: '#D78A24',
          icon: 'mdi-star',
          title: '2020',
          content: '玉食堂成立',
        },
        {
          color: '#3C5D44',
          icon: 'mdi-star',
          title: '2022',
          content: '玉食堂成立',
        },
        {
          color: '#D78A24',
          icon: 'mdi-ray-end',
          title: '2024',
          content: '玉食堂成立',
        },
])

definePage({
  name: 'about',
  meta: {
    title: 'ABOUT US',
    login: false,
    admin: false
  }
})

const pageTitle = ref('關於玉食堂')
const newsList = ref([
  { id: 1, title: '消息標題 1', date: '2024-01-01', content: '這是消息內容 1' },
  { id: 2, title: '消息標題 2', date: '2024-02-01', content: '這是消息內容 2' },
])
</script>

<style scoped>
html, body, #app{
height: 100%;
margin: 0;
padding: 0;
}

.my-v-container{
padding: 0;
margin: 0px;
}

h1 {
  margin-bottom: 20px;
}

.bg-dark{
background-color: #3C5D44;
}
.bg-light{
background-color: #d6d5d1;
}

</style>