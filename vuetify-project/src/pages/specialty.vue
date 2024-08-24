<template>
  <v-container fluid>
    <!-- MENU -->
    <v-row class="mx-6">
      <v-col cols="12">
        <h4 class="text-h2">SPECIALTY 私房主廚料理</h4>
      </v-col>
    </v-row>
    <!-- 菜單導航分類 -->
    <v-row class="mx-6">
      <v-col
      cols="12"
      >
        <!-- 使用 v-tabs 標籤包 v-tab 跑 v-for -->
        <!-- grow 均勻地分佈並填滿整個容器 -->
        <v-tabs
          v-model="tab"
          grow
          bg-color="#D78A24"
          height="62"
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
          show-arrows
          slider-color="#D66425"
        >
          <v-tab v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
  <!-- 菜單顯示 -->
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <v-col
        v-for="(specialty, index) in filterSpecialties"
        :key="index"
        class="d-flex justify-center align-center p-2"
        cols="12"
        md="6"
        lg="4"
      >
        <SpecialtyCard v-bind="specialty" />
      </v-col>
      <v-col cols="12">
        <v-pagination v-model="page" :length="pages" rounded="circle" @update:model-value="loadProducts" ></v-pagination>
      </v-col>
    </v-row>
</v-container>
</template>




<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { definePage } from 'unplugin-vue-router/runtime'
// Vuetify 提供的一個 Composition API，用來檢查當前設備的顯示屬性
// import { useDisplay } from 'vuetify'
import { useSnackbar } from 'vuetify-use-dialog'
// 取資料要把 API 方法拉進去
import { useApi } from '@/composables/axios.js'
// Components
import SpecialtyCard from '@/components/card/specialtyCard.vue';

definePage({
  name: 'Specialty',
  meta: {
    title: 'Specialty 私房主廚料理',
    login: false,
    admin: false
  }
})

// 取資料用的 api
const { api } = useApi();
// snackbar
const createSnackbar = useSnackbar()
// 設定菜單分類和當前選中的分類
const tab = ref('料理包預購 | MealKit Pre-order');
const categories = ref([ '料理包預購 | MealKit Pre-order','私廚預購 | Chef Pre-order' ]);

// specialty 商品清單陣列 ref([])
const specialties = ref([])

// 儲存所有產品的反應式變數
const filterSpecialties = computed(()=>{
  return specialties.value.filter(specialty => specialty.category === tab.value)
})

// pages 代表總頁數
// 綁定 :length="pages" 來設定總頁數
const pages = ref(1);
// page 代表當前頁數
// 綁定 v-pagination 的 v-model
const page = ref(1); 


// 0717/ 00:32:45 取商品的方法
const loadProducts = async () => {
  try {
    const { data } = await api.get('/specialty', {})
    specialties.value.splice(0, specialties.value.length, ...data.result.data)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
loadProducts()


</script>

<style scoped>
.scrollable {
overflow-x: auto;
white-space: nowrap;
}
.pa-2 {
padding: 8px !important;
}
.w-75 {
width: 75% !important;
}
.mb-4 {
margin-bottom: 16px !important;
}
</style>
