<template>
  <v-app-bar app>
    <v-toolbar-title class="text-cus">管理者首頁</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        label="Search"
        single-line
        hide-details
        append-icon="mdi-magnify"
      ></v-text-field>
  </v-app-bar>

  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn-toggle v-model="selectedStatus" divided mandatory>
          <v-btn value="all">所有管理者</v-btn>
          <v-btn value="onProcess">查看營收登記</v-btn>
          <v-btn value="completed">查看代辦事項</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card class="card-cus" hover @click="showRecord(userId)">
          <v-card-title>管理員編號: {{ userId }}</v-card-title>
          <v-card-subtitle>登入時間: {{ loginTime }}</v-card-subtitle>
          <v-card-subtitle>登入身分: {{ roleLabel }}</v-card-subtitle>
            <v-card-text>
              <v-list>
                <v-list-item>
                    <v-list-item-title class="mb-5">可管理項目 :</v-list-item-title>
                    <v-card-actions>
                      <v-btn class="mb-3 card-vbtn">即時點餐訂單管理</v-btn>
                      <v-btn class="mb-3 card-vbtn">私廚預購訂單管理</v-btn>
                      <v-btn v-if="isAdmin" class="mb-3 card-vbtn">營收統計管理</v-btn>
                    </v-card-actions>
                </v-list-item>
              </v-list>
            </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="card-cus" hover>
          <v-card-title>管理員編號: 6666</v-card-title>
          <v-card-subtitle>登入時間: 2024-08-26-20:30</v-card-subtitle>
          <v-card-text>
            <v-list>
              <v-list-item>
                  <v-list-item-title class="mb-5">可管理項目 :</v-list-item-title>
                  <v-card-actions>
                    <v-btn class="mb-3 card-vbtn">即時點餐訂單管理</v-btn>
                    <v-btn class="mb-3 card-vbtn">私廚預購訂單管理</v-btn>
                    <v-btn class="mb-3 card-vbtn">營收統計管理</v-btn>
                  </v-card-actions>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="card-cus" hover>
          <v-card-title>管理員編號: 1111</v-card-title>
          <v-card-subtitle>登入時間: 2024-08-25-18:10</v-card-subtitle>
          <v-card-text>
            <v-list>
              <v-list-item>
                  <v-list-item-title class="mb-5">可管理項目 :</v-list-item-title>
                  <v-card-actions>
                    <v-btn class="mb-3 card-vbtn">即時點餐訂單管理</v-btn>
                    <v-btn class="mb-3 card-vbtn">私廚預購訂單管理</v-btn>
                    <v-btn class="mb-3 card-vbtn">營收統計管理</v-btn>
                  </v-card-actions>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user.js';
  import { definePage } from 'vue-router/auto'

  definePage({
    meta: {
      title: '玉食堂 | 管理者頁面',
      login: true,
      admin: true
    }
  })

  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);
  const loginTime = computed(() => userStore.loginTime);
  const roleLabel = computed(() => {
    switch(userStore.role) {
      case 1: return 'EMPLOYEE';
      case 2: return 'ADMIN';
      default: return 'USER';
    }
  });
  
  const isAdmin = computed(() => userStore.isAdmin);
  
  const selectedStatus = ref()

  // 這個函數用於顯示管理員的操作記錄
  const showRecord = (id) => {
    // 在這裡處理點擊卡片後顯示操作紀錄的邏輯
    console.log(`顯示管理員 ${id} 的操作紀錄`);
  };

</script>

<style scoped>
  .bg-dark{
    background-color: #3C5D44;
    color: white;
  }
  .bg-er{
    background-color: #D66425;
    color: white;
  }
  .text-cus{
    color: #2C3E31;
    font-weight: bold;
    font-size: 24px;
  }
  .card-cus{
    min-width: 380px;
  }
  .card-vbtn{
    background-color: #6e8072;
    color: white;
  }
</style>

<!-- 0716/ 01:22:20 -->
<!-- vite-plugin-vue-layouts 引用的語法 -->
<route lang="yaml">
meta:
  layout: admin
</route>
