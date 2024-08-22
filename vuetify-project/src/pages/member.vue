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

<!-- 第一版用 v-sheet 包 v-form 的註冊、登入
Register
<v-sheet
    class="pa-4 text-center mx-auto mb-5"
    elevation="4"
    max-width="600"
    rounded="lg"
    width="100%"
-->
  <!-- 把下面建立好的欄位 schema 綁上來 v-model-->
      <!-- <h2>Register | 註冊</h2> -->
      <!-- 在 form 上面寫當表單送出時，@submit.prevent="submit" -->
      <!-- isSubmitting 是從 useForm 拉出來的東西，送出時停用 -->
      <!-- <v-form @submit.prevent="submit" :disabled="isSubmitting">
        <v-text-field 
        label="account | 帳號"
        minlength="6"
        maxlength="16"
        counter
        v-model="account.value.value"
        :error-messages="account.errorMessage.value"
        ></v-text-field>
        <v-text-field 
        label="password | 密碼" 
        type="password"
        minlength="6"
        maxlength="16"
        v-model="password.value.value"
        :error-messages="password.errorMessage.value"
        counter
        ></v-text-field>
        <v-text-field
        label="phoneNumber | 電話"
        minlength="10"
        maxlength="10"
        counter
        v-model="phoneNumber.value.value"
        :error-messages="phoneNumber.errorMessage.value"
        ></v-text-field> -->
        <!-- v-btn 有 :loading 的屬性可以用，控制會不會有圓圈 -->
        <!-- 綁定 isSubmitting 這樣送出時會有轉圈樣子-->
        <!-- <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting">Register | 註冊</v-btn>
        <v-spacer/>
        <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting">LINE 帳號註冊</v-btn>
      </v-form>
</v-sheet> -->


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