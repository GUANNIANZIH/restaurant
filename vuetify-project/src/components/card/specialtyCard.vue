<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    height="400px"
    width="520px"
    class="my-5 ma-5"
    elevation="3"
    rounded="16"
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
    
    <v-row class="fill-height">
      <v-col
      cols="6"
      height="100%"
      class="d-flex flex-column align-center justify-center h-100 bg-light"
      >
        <v-card-item>
          <v-card-title>{{ name }}</v-card-title>
          <v-card-subtitle>
            <span class="me-1">{{ category }}</span>
            <v-icon
              color="error"
              icon="mdi-fire-circle"
              size="small"
            ></v-icon>
          </v-card-subtitle>
          <v-card-text>
            <div>{{ description }}</div>
          </v-card-text>
        </v-card-item>
        <v-rating
          :model-value="4.5"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
          >
        </v-rating>
        <v-card-actions>
          <v-btn
            class="bg-dark p-5"
            color="white"
            text="addCart"
            block
            hover
            @click="addCart"
          ></v-btn>
        </v-card-actions>
      </v-col>
      <v-img
        height="100%"
        :src="image"
        cover
      ></v-img>
    </v-row>
  </v-card>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user.js'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'

const props = defineProps({
      // 一個個定義型態，也可以只寫欄位名稱
      _id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      sell: {
        type: Boolean,
        required: true
      }
    })

  const user = useUserStore()
  const router = useRouter()
  const createSnackbar = useSnackbar()
  const loading = ref(false)


  // 定義 addCart 方法
  const addCart = async () => {
    if (!user.isLogin){
      router.push('/member')
      return
    }
    loading.value = true
    const result = await user.addSpecialtyCart(props._id, 1)
    createSnackbar({
    text: result.text,
    snackbarProps: {
      color: result.color
    }
  })
  loading.value = false
  }
  setTimeout(() => {
    loading.value = false
  }, 2000)

</script>

<style scoped>
.bg-dark{
background-color: #5e7764;
}
.bg-light{
background-color: #ffffff;
}

.v-row{
  margin: 0;
}

</style>
