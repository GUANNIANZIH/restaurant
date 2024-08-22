<template>
  <!-- v-container-drawer 手機板導航 -->
  <v-navigation-drawer v-if="mobile" v-model="drawer" class="h-100">
    <v-list nav class="h-100 d-flex align-start flex-column" >
        <template 
          v-for="(i, index) in navItems" :key="i.to">
            <v-list-item
            v-if="i.show"
            :to="i.to"
            :prepend-icon="i.icon"
            :title="i.text"
            :class="{'special-item':index === 6 || index === 7 || index === 8}"
            class="d-flex w-100"
            rounded="sm"
            >
              <template #append>
                <v-badge color="#D78A24" :content="user.cart" v-if="i.to === '/profile' && user.cart > 0"></v-badge>
              </template>
          </v-list-item>
          <v-list-item v-if="index === 5" class="mb-auto" />
        </template>
      <v-list-item prepend-icon="mdi-star" v-if="user.isLogin" title="LOGOUT" @click="logout" class="w-100"></v-list-item>
      <!-- 增加一個 "查看店內訂單狀態 Order Progress" 的 v-list-item -->
      <v-list-item prepend-icon="mdi-star" @click="openOrderProgressClick" title="Order Progress" class="w-100"></v-list-item>
    </v-list>
  </v-navigation-drawer>

<!-- v-app-bar 電腦版導航列 -->
  <v-app-bar scroll-behavior="elevate">
    <v-container class="d-flex align-center justify-space-between w-100">
      <v-spacer />
      <!-- mobile 漢堡選單 -->
      <!-- 顯示一個應用欄導航圖標，當點擊會打開側邊 drawer -->
      <template v-if="mobile">
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <!-- 電腦版選單 -->
      <template v-else>
        <div class="d-flex justify-space-between" style="width: 100%">
          <!-- 0709/ 04:01:25 -->
          <!-- 因為 v-for 不能跟 v-if 寫在一起，所以才會拆開來多一個 template 包起來，
          把 v-for 往外拉，然後在裡面再用 v-if 去判斷是否顯示
          -->
          
          <!-- 拿掉電腦導覽列的 icon :prepend-icon="item.icon" -->
        <template
        v-for="(item, index) in navItems" :key="item.to">
          <v-btn
          v-if="item.show"
          :to="item.to"
          :class="{'special-item':index === 6 || index === 7 || index === 8}"
          >
            {{ item.text }}
            <!-- 0709/ 04:04:50 -->
            <!-- 顯示購物車數量 v-badge -->
            <!-- && user.cart > 0 -->
            <v-badge color="#D78A24" :content="user.cart" v-if="item.to === '/profile' && user.cart > 0" inline></v-badge>
          </v-btn>
          <v-spacer v-if=" user.isLogin && index === 5" />
        </template>
        <v-btn prepend-icon="mdi-star" v-if="user.isLogin" @click="logout"> Logout </v-btn>
        <!-- 增加一個 "查看店內訂單狀態 Order Progress" 的 v-btn -->
        <v-btn prepend-icon="mdi-star" @click="openOrderProgressClick">Order Progress</v-btn>
        </div>
      </template>
    </v-container>
  </v-app-bar>

  <v-main>
    <!-- router-view 用來顯示頁面內容 -->
    <router-view></router-view>
    <!-- orderProgress 全局的對話框元件 -->
    <!-- 在應用中的每一個頁面都能夠響應和顯示對話框 (dialog)，
        將 DialogComponent 放在一個全局的父組件中-->
    <orderProgress />
  </v-main>
  <AppFooter />
</template>

<script setup>
// ref 處理響應式、computed 處理計算屬性
import { ref, computed } from 'vue'
// Vuetify 提供的一個 Composition API，用來檢查當前設備的顯示屬性
import { useDisplay } from 'vuetify'
// 引入 stores/use.js 中的 useUserStore
import { useUserStore } from '@/stores/user'
import AppFooter from '@/components/AppFooter.vue'
// snackbar 顯示成功、失敗，記得要要先做 "套件安裝前置設定動作"
import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
// 因為 DialogComponent.vue 中已經使用了 dialogStore.isOpen 來控制 v-dialog 的顯示與隱藏，
// 因此你可以在任何引入 useDialogStore 的地方打開或關閉該對話框。
import { useDialogStore } from '@/stores/dialog.js'
import orderProgress from '@/components/dialog/orderProgress.vue';

const { mobile } = useDisplay()
// 0709/ 03:57:55
// 使用 useUserStore() 來獲取 userStore，把使用者的狀態拉進來，
// 在 navItem 就可以使用 userStore 來判斷是否為使用者身分。
// 在 navItem 加上 show 的欄位，"註冊" 應該要在未登入的情況下才顯示。 show: !user.isLogin
const user = useUserStore()
// dialogStore
const dialogStore = useDialogStore()

const openOrderProgressClick = () => {
  dialogStore.openDialog()
}

// 綁定 v-model="drawer"
const drawer = ref(false)
// 0709/ 03:19:50
// snackbar、confirm 進行引用，再去修改 loginCard.vue 裡面的 UX 體驗
const createConfirm = useConfirm()
const createSnackbar = useSnackbar()

// 0709/ 03:57:20
// 導航列 navItems: 使用 computed 去控制導覽列顯示的情況
// 在 navItem 加上 show 去控制欄位的顯示，show: !user.isLogin (沒登入出現)
const navItems = computed(() => {
  return [
    // 以下幾個都是使用者不需要登入就可以看到的
    { to: '/', text: 'HOME', icon:'mdi-home', show: !user.isLogin || user.isLogin },
    { to: '/news', text: 'NEWS', icon:'mdi-information-slab-circle', show: !user.isLogin || user.isLogin },
    { to: '/about', text: 'ABOUT US', icon:'mdi-account-reactivate', show: !user.isLogin || user.isLogin },
    { to: '/menu', text: 'MENU', icon:'mdi-arrow-down-drop-circle', show: !user.isLogin || user.isLogin},
    { to: '/specialty', text: 'SPECIALTIES', icon:'mdi-arrow-down-drop-circle', show: !user.isLogin || user.isLogin },
    { to: '/member', text: 'MEMBER ZONE', icon:'mdi-wallet-bifold', show: !user.isLogin},
    // 需要登入才可以看到 /cart、profile (使用者、員工、管理者)
    { to: '/profile', text: 'CART & PROFILE', icon:'mdi-account', show: user.isLogin},
    // 管理者頁面 (員工 EMPLOYEE: 1, 管理者 ADMIN: 2)
    // 0709/ 03:58:40 判斷使用者有登入 + 使用者為管理員
    // { to: '/admin', text: 'ADMIN', show: user.isLogin && (user.isEmployee || user.isAdmin)}
    { to: '/admin', text: 'ADMIN', icon:'mdi-account-cog', show: user.isLogin && (user.isEmployee || user.isAdmin)}
    // show: user.isLogin && user.isAdmin
  ]
})

const logout = async () => {
  await user.logout()
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: '#D78A24'
    }
  })
}

</script>

<style scoped>
.logo{
height: 56px;
}

.special-item{
  position: relative;
}

.v-btn{
  font-size: 12px;
  margin-right: 12px;
}

.v-container{
  padding: 0;
  margin: auto;
}

.spacer-item{
  height: 400px
}

.v-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>