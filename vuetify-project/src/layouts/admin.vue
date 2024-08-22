<template>
  <!-- permanent 固定側邊欄 -->
  <v-sheet class="main-container">
    <v-navigation-drawer rounded permanent location="right" class="navigation h-100">
    <v-list>
      <v-list-item :prepend-avatar="avatar" :title="user.account"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav class="d-flex align-start flex-column">
      <template v-for="(i, index) in navItems" :key="i.to">
        <v-list-item
          :to="i.to"
          :prepend-icon="i.icon"
          :title="i.text"
          :class="{'special-item': index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5,
            'other-items': index === 6
          }"
          class="d-flex w-100"
          rounded="sm"
        >
        </v-list-item>
      </template>
    </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>

  </v-sheet>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { definePage } from 'vue-router/auto'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

definePage({
  meta: {
    title: 'ADMIN PAGE',
    login: true,
    admin: true
  }
})

const drawer = ref(true)

const navItems = [
  // 管理者首頁
  { to: '/admin/', text: '管理者首頁', icon: 'mdi-home-edit' },
  // 即時點餐訂單管理
  { to: '/admin/orders', text: '即時點餐訂單管理', icon: 'mdi-rice' },
  // 預購私廚訂單管理
  { to: '/admin/ordersSpecialty', text: '預購私廚訂單管理', icon: 'mdi-chef-hat' },
  // 商品上下架管理
  { to: '/admin/products', text: '餐點管理', icon: 'mdi-list-box' },
  // 活動管理
  { to: '/admin/news', text: '活動管理', icon: 'mdi-email-newsletter' },
  // 進出貨、營收登記
  { to: '/admin/revenue', text: '營收登記', icon: 'mdi-store-edit' },
  // 回首頁
  { to: '/', text: '回網站首頁', icon: 'mdi-home' }
]

const avatar = computed(() => {
  return `https://api.multiavatar.com/${user.account}.png`
})
</script>

<style scoped>
.main-container{
  display: grid;
  /* 定義網格容器中列的寬度 */
  grid-template-columns: 100% 100%;
  /* width: 95%; */
  /* 佔滿整個視窗高度  */
  height: 90vh; 
  overflow-x: hidden; /* 隱藏垂直滾動條 */
  margin: 46px;
  background: rgba(142, 156, 142, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
    0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1;
  position: relative;
}

.v-navigation-drawer__content {
    flex: 0 1 auto;
    max-width: 100%;
}

.navigation{
  background-color: #3C5D44;
  color: white;
  border-radius: 0px 12px 12px 6px ;
}

.special-item {
  background-color: #234731;
  border: 1.6px solid #234731;
  border-radius: 24px
}

.other-items{
  background-color: #7c857f;
  border: 1.6px solid #a1a1a1;
  border-radius: 24px
}

</style>

<!-- 0716/ 01:22:20 -->
<!-- vite-plugin-vue-layouts 引用的語法 -->
<route lang="yaml">
meta:
    layout: admin
</route>
