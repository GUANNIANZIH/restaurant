<template>
    <v-card
    class="ma-5"
    width="450"
    :disabled="loading"
    :loading="loading"
    >
        <!-- loader 是 slot 名稱、isActive 是從父組件傳入的屬性，表示進度條的狀態 -->
    <template v-slot:loader="{ isActive }">
        <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
        ></v-progress-linear>
    </template>
        <v-img
            class="align-end text-white"
            height="300"
            :src="image"
            cover
        ></v-img>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-subtitle class="pt-4">
        {{ subtitle }}
        </v-card-subtitle>
        <v-card-text>
        <div>{{content}}</div>
        </v-card-text>

        <v-card-actions class="d-flex justify-center primary-color">
        <v-btn color="white" text="Explore" @click="explore"></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
    import { ref } from 'vue'

    defineProps({
        _id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        isPublished: {
            type: Boolean,
            required: true
        }
    })

  // 定義響應式變數
  const show = ref(false)
  const loading = ref(false)
  const selection = ref(1)

  // 定義方法
  const explore = () => {
    loading.value = true
  }
  setTimeout(() => {
    loading.value = false
  }, 2000)


</script>

<style scoped lang="scss">
.primary-color{
  background-color: #dadada;
}
</style>