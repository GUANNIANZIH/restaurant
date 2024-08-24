<template>
<v-container fluid class="m-0 p-0 my-v-container">
  <!-- parallax -->
  <v-row>
      <v-col cols="12" class="w-100">
        <!-- 使用 v-parallax 視差效果 -->
        <v-parallax 
        height="600" 
        src="@/assets/card-products/飲品新上市.png" 
        alt="會員專區 Banner" 
        class="banner">
      </v-parallax>
    </v-col>
    <v-col cols="12" class="w-100"></v-col>
  </v-row>

  <!-- dialog 註冊成功 -->
  <v-fade-transition hide-on-leave>
        <v-card
          v-if="successDialog"
          append-icon="$close"
          class="mx-auto my-5"
          elevation="4"
          max-width="400"
        >
          <template v-slot:append>
            <v-btn icon="$close" variant="text" @click="successDialog = false"></v-btn>
          </template>
          <v-divider></v-divider>
          <div class="py-12 text-center">
            <v-icon
              class="mb-6"
              color="#3C5D44"
              icon="mdi-check-circle-outline"
              size="64"
            ></v-icon>
            <div class="text-h4 font-weight-bold">會員註冊成功</div>
          </div>
          <v-divider></v-divider>
          <div class="pa-4 text-end">
            <v-btn
              class="text-none"
              color="medium-emphasis"
              min-width="92"
              variant="outlined"
              rounded
              @click="successDialog = false"
            >
              Close
            </v-btn>
          </div>
        </v-card>
  </v-fade-transition>

  <!-- dialog 註冊失敗 -->
  <v-fade-transition hide-on-leave>
        <v-card
          v-if="failureDialog"
          append-icon="$close"
          class="mx-auto my-5"
          elevation="4"
          max-width="400"
        >
          <template v-slot:append>
            <v-btn icon="$close" variant="text" @click="failureDialog = false"></v-btn>
          </template>
          <v-divider></v-divider>
          <div class="py-12 text-center">
            <v-icon
              class="mb-6"
              color="#D78A24"
              icon="mdi-alert-circle-outline"
              size="64"
            ></v-icon>
            <div class="text-h4 font-weight-bold">會員註冊失敗</div>
          </div>
          <v-divider></v-divider>
          <div class="pa-4 text-end">
            <v-btn
              class="text-none"
              color="medium-emphasis"
              min-width="92"
              variant="outlined"
              rounded
              @click="failureDialog = false"
            >
              Close
            </v-btn>
          </div>
        </v-card>
  </v-fade-transition>

  <!-- 分頁: 註冊/登入 -->
  <v-card class="overlay-card" width="650px">
    <v-toolbar color="surface">
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          grow
        >
          <v-tab
            :value="1"
          >
          <p class="text-h6">Register | 註冊</p>
          </v-tab>
          <v-tab
            :value="2"
          >
          <p class="text-h6">Login | 登入</p>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-window v-model="tabs">
      <!-- 增加 @registerSuccess="switchToLoginTab" -->
      <!-- 自定義事件 registerSuccess，並在事件觸發時執行 switchToLoginTab 方法 -->
      <registerForm @registerSuccess="switchToLoginTab" />
      <loginForm />
    </v-tabs-window>
  </v-card>


</v-container>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { ref } from 'vue'

import registerCard from '@/components/form/registerForm.vue'
import loginCard from '@/components/form/loginForm.vue'

definePage({
  name: 'member',
  meta: {
    title: 'MEMBER ZONE',
    login: false,
    admin: false
  }
})

const tabs = ref(1) // ref(1) 註冊、(2) 登入
const successDialog = ref(false);
const failureDialog = ref(false);

const switchToLoginTab = () => {
  tabs.value = 2; // 切換到 Login 標籤
};

</script>

<!-- 0709 /01:45:50 (錯誤) -->
<!-- 使用 vite-plugin-vue-layouts
  告訴網頁這頁要使用哪一個 layouts，也可以把 name 加在下面-->
<!-- <route lang="yaml">
  meta:
    title: '會員專區'
</route> -->

<style scoped>
.banner {
  width: 100%;
  height: auto;
  margin-bottom: 360px;
  position: relative
}

.my-v-container{
padding: 0;
margin: 0px;
}

.v-col{
  padding: 0;
}

.overlay-card{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>