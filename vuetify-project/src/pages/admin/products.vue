<template>
  <v-container>
    <v-row>
      <!-- 
      0716/ 02:05:10 商品管理頁面:
      1. 製作 "新增、編輯" 的 v-btn 去綁定 v-dialog 使用 id 去控制 dialog "新增、編輯" 動作
      2. 顯示商品的 v-data-table-server 表格畫面
      如果覺得這頁東西太多，可以使用元件的方式將東西獨立出去。
      -->
      <v-col cols="12">
        <h1 class="text-center text-cus">餐點 & 私廚上下架管理</h1>
      </v-col>
      <v-col cols="12">
        <!-- 0716/ 02:02:30 -->
        <!-- 新增商品 @click="openDialog(null)" -->
        <!-- 當按下 "新增商品" 會跳出 v-dialog 對話框，因為 v-dialog 綁定 v-model="dialog.open" -->
        <v-btn color="#3C5D44" class="me-4" @click="openMenuDialog(null)">菜單管理</v-btn>
        <!-- 新增 "私廚料理管理" v-btn -->
        <v-btn color="#3C5D44" @click="openSpecialtyDialog(null)">私廚料理管理</v-btn>
      </v-col>
      <v-col cols="12">
        <v-toolbar color="surface">
          <template v-slot:extension>
            <v-tabs
                v-model="tabs"
                grow
              >
                <v-tab
                  :value="1"
                >
                <p class="text-h6">Menu Management | 菜單管理</p>
                </v-tab>
                <v-tab
                  :value="2"
                >
                <p class="text-h6">Specialty Management | 私廚料理管理</p>
                </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-tabs-window v-model="tabs">
            <v-tabs-window-item :value="1" class="h-75">
              <!-- 這裡使用了 defineProps 去接收父組件的方法 -->
              <!-- 將一個方法 openMenuDialog 作為 prop 傳遞給子組件 menuProducts_dataTable -->
              <!-- :on-open-menu-dialog 是一個 prop，這個 prop 將會接收來自父組件的資料或方法。
              在 Vue 中，使用 : 前綴表示綁定的是一個 JavaScript 表達式（而非靜態字串） -->
              <!-- 注意命名風格跟子組件  menuProducts_dataTable 裡面命名不同-->
              
              <!-- 原本使用 defineProps: <menuProducts_dataTable :on-open-menu-dialog="openMenuDialog" /> -->
              <menuProducts_dataTable  class="h-75" />
            </v-tabs-window-item>

            <v-tabs-window-item :value="2"  class="h-75">
              <!-- 原本使用 defineProps: <specialtyProducts_dataTable :on-open-specialty-dialog="openMenuDialog"/> -->
              <specialtyProducts_dataTable  class="h-75" />
            </v-tabs-window-item>
        </v-tabs-window>

      </v-col>
    </v-row>
  </v-container>
  <!-- dialog 元件 -->
  <menuProductDialog ref="menuDialogRef"/>
  <specialtyProductDialog ref="specialtyDialogRef"/>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { ref, onMounted } from 'vue'
import mitt from '@/mitt.js'
// import * as yup from 'yup'
// import { useForm, useField } from 'vee-validate'
// 03:06:48 把資料送出去所以要引入 useApi，去跟 API 做通溝，記得 const useApi
// 因為要做新增商品，要登入才可以做新增動作，所以要使用 apiAuth
// import { useApi } from '@/composables/axios'
// import { useSnackbar } from 'vuetify-use-dialog'

// Dialog
import menuProductDialog from '@/components/dialog/menuProductDialog.vue'
import specialtyProductDialog from '@/components/dialog/specialtyProductDialog.vue'
// dataTable
import menuProducts_dataTable from '@/components/dataTable/menuProducts_dataTable.vue'
import specialtyProducts_dataTable from '@/components/dataTable/specialtyProducts_dataTable.vue'

definePage({
  meta: {
    title: '玉食堂 | 商品管理',
    login: true,
    admin: true
  }
})

const tabs = ref(1)
// 引用 dialog
const menuDialogRef = ref(null)
const specialtyDialogRef = ref(null)

// 記得 useApi()
// const { apiAuth } = useApi()
// const createSnackbar = useSnackbar()
// fillAgent 上傳圖片套件
// const fileAgent = ref(null)

// 0716/ 02:01:20
// 定義 v-btn 的點擊事件
// 因為 v-dialog 要做 "新增"、"編輯"，所以如果 dialog 是編輯的話，要將商品編輯資料傳進來
// 當商品點擊 @click="openDialog(null)" 時，會執行 openDialog，並傳入商品資料

const openMenuDialog = (item) => {
  mitt.emit('openMenuDialog', item)
}

const openSpecialtyDialog = (item) => {
  mitt.emit('openSpecialtyDialog', item)
}


// 對應 <v-btn color="#3C5D44" class="me-4" @click="openMenuDialog(null)">菜單管理</v-btn>
// const openMenuDialog = (item) => {
//   if (menuDialogRef.value) {
//     // 如果存在 menuDialogRef 並且已經被綁定了，就打開它
//     menuDialogRef.value.open();
//   }
//   // 02:01:30
//   // 如果有 @click="openDialog" 會傳入 item，代表是編輯 (先寫新增再回頭寫編輯)

//   // 0716/ 05:14:20 補回編輯的部分
//   // 注意每個欄位都要加上 .value 因為是 ref()，要讓對話框帶入原本 create 的值，同時可以做編輯
//   if (item) {
//     console.log('編輯模式 item:', item);
//     console.log('item._id',item._id)
//     console.log('menuDialogRef.value:',menuDialogRef.value)
//     console.log('menuDialogRef.value.dialog:',menuDialogRef.value.dialog)
//     console.log('menuDialogRef.value.dialog.open:',menuDialogRef.value.dialog)
//     // 如果傳入 item，表示是在編輯模式
//     // 綁定以下，會把編輯商品原本創立的值給帶入 dialog 中。
//     // menuDialogRef.value.dialog.id = item._id // item._id，從 item 物件中提取的 _id 值
//     // menuDialogRef.value.dialog.name = item.name
//     // menuDialogRef.value.dialog.price = item.price
//     // menuDialogRef.value.dialog.description = item.description
//     // menuDialogRef.value.dialog.category = item.category
//     // menuDialogRef.value.dialog.sell = item.sell

//   // 0716/ 02:01:45
//   // 如果沒有 item 傳入 null，dialog.id = '' 為空，dialog.open = true 代表打開對話框，就可以去寫打開後的 v-dialog 對話框樣式
//   // v-btn @click="openDialog(null) 新增的時候是 null，所以會進到 else，設定 id=''為空，代表為新增模式
//   // 
//   } else {
//     // 如果沒有傳入 item，表示是在新增模式，清空所有相關的值
//     menuDialogRef.value.dialog.id = ''
//     menuDialogRef.value.dialog.name = '';
//     menuDialogRef.value.dialog.price = '';
//     menuDialogRef.value.dialog.description = '';
//     menuDialogRef.value.dialog.category = '';
//     menuDialogRef.value.dialog.sell = false;
//   }
//     // 原本設定 const dialog = ref({}) 裡面設定為 false，
//     // 這裡當 "新增動作" 打開變成 true，
//     // 會對應上面出現的對話框 v-model = "dialog.open"，可以調整寬度 persistent width="500" 
//     menuDialogRef.value.dialog.open = true
// }

// 打開 SpecialtyDialog 的函數
// const openSpecialtyDialog = (item) => {
//   if (specialtyDialogRef.value) {
//     specialtyDialogRef.value.open();
//   }
//   if (item) {
//     console.log('編輯模式 item:', item);
//     console.log('item._id',item._id)
//     console.log('specialtyDialogRef.value:',specialtyDialogRef.value)
//     console.log('specialtyDialogRef.value.dialog:',specialtyDialogRef.value.dialog)
//     console.log('specialtyDialogRef.value.dialog.open:',specialtyDialogRef.value.dialog)

//     specialtyDialogRef.value.dialog.name = item.name
//     specialtyDialogRef.value.dialog.price = item.price
//     specialtyDialogRef.value.dialog.description = item.description
//     specialtyDialogRef.value.dialog.category = item.category
//     specialtyDialogRef.value.dialog.sell = item.sell

//   } else {
//     // 如果沒有傳入 item，表示是在新增模式，清空所有相關的值
//     specialtyDialogRef.value.dialog.id = ''
//     specialtyDialogRef.value.dialog.name = '';
//     specialtyDialogRef.value.dialog.price = '';
//     specialtyDialogRef.value.dialog.description = '';
//     specialtyDialogRef.value.dialog.category = '';
//     specialtyDialogRef.value.dialog.sell = false;
//   }
//     // 原本設定 const dialog = ref({}) 裡面設定為 false，
//     // 這裡當 "新增動作" 打開變成 true，
//     specialtyDialogRef.value.dialog.open = true
// };

</script>

<style scoped>
    .text-cus{
    color: #2C3E31;
    font-weight: bold;
    }
</style>

<!-- 0716/ 01:22:20 -->
<!-- vite-plugin-vue-layouts 引用的語法 -->
<route lang="yaml">
meta:
  layout: admin
</route>
