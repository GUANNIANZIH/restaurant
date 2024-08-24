<template>
    <v-container
    fluid
    class="my-v-container">
    <!--控制 v-carousel 自動換頁
        cycle
        :interval="7000"
        hide-delimiters
        :hide-delimiter-background="true" -->
        <v-carousel 
        v-model="currentSlide"
        :hide-delimiter-background="true" 
        height
        class="custom-carousel bg-y">
            <v-carousel-item
                v-for="(slide, index) in slides"
                :key="index"
                :src="slide.url"
                transition="fade-transition"
                reverse-transition="fade-transition"
                cover
            >
            <div class="slide-content h-100 w-100">
                <div class="title-wrapper">
                    <h1 class="text-h3">{{ slide.title }}</h1>
                    <h2 class="text-h6">{{ slide.subtitle }}</h2>
                </div>
            </div>
            </v-carousel-item>
        </v-carousel>

    </v-container>

    <v-container
    fluid
    class="my-v-container"
    >
        <v-sheet
        class="h-100 d-flex flex-column justify-center align-center position-relative"
        min-height="520px"
        >
            <v-sheet
            width="100%"
            min-height="400px"
            >
                <v-img
                cover
                height="400px"
                class="d-flex justify-center align-center text-center"
                gradient="to top right, rgba(0,0,0,.5), rgba(255,255,255,.7)"
                src="@/assets/banner/大banner-1.png">

                </v-img>
            </v-sheet>
        </v-sheet>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';

const slides = ref([
  { url: new URL('@/assets/banner/大banner-design00.png', import.meta.url).href, title: '經典海鮮湯麵', subtitle: 'Classic Seafood Noodle Soup' },
  { url: new URL('@/assets/banner/大banner-design02.png', import.meta.url).href },
  { url: new URL('@/assets/banner/大banner-design00.png', import.meta.url).href, title: '懷念的好滋味', subtitle: 'A Nostalgic Good Taste' },
  { url: new URL('@/assets/banner/大banner-design02.png', import.meta.url).href },
]);

const arrowIcon = ref('mdi-chevron-right');
const currentSlide = ref(0);

const nextSlide = () => {
  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0; // 循環到第一個幻燈片
  }
};

</script>

<style scoped lang="scss">
.my-v-container{
    padding: 0;
    margin: 0px;
}

.v-container{
    padding: 0;
}

.bg-dark{
    background-color: #3C5D44;
}

.bg-light{
    background-color: #d6d5d1;
}

.bg-y {
    background: linear-gradient(to bottom left, rgba(215, 138, 36, 0.7), rgba(60, 93, 68, 1))
}

.slide-content {
    /* 自定義的樣式 */
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0%;
    // background-color: #d6d5d1;
    /* 漸層背景色從右上 (#D78A24, 透明度 70%) 到左下 (#3C5D44, 透明度 70%) */
    background: linear-gradient(to bottom left, rgba(215, 138, 36, 0.7), rgba(60, 93, 68, 0.85));
    color: white;
    text-align: left;
    clip-path: circle(60px at 95%)!important;
    transition: clip-path 0.75s ease!important;
    z-index: 1000;
}

.slide-content:hover {
  clip-path: circle(180% at 90%) !important;
}

.title-wrapper{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.custom-carousel .v-window-item {
  transition: transform 0.1s ease-in-out !important; /* 調整過渡效果的速度 */
}
</style>