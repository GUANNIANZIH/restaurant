<!-- 商品 component 0717 00:48:30 開始 -->
<!-- 0717 01:14:23
    使用 router-link 可以透過連結到 products/[id].vue，商品各自的頁面，
    作法: 先建立商品的 component(component/productCard.vue)，再建立每個商品自己的商品頁 products/[id].vue，
    商品頁 products/[id].vue 為動態路由，可以使用同一個頁面去顯示不同的商品，
    把這個頁面當作美個商品頁各自的統一模板，
    再回到 component/productCard.vue，把商品的資料綁定到商品頁的連結上，
    並使用 router-link 連結到商品頁
-->
<!-- 0717 01:56:00
    做 component/productCard.vue 購物車 v-btn 功能、各個商品頁面 products/[id].vue 也要有加入購物車的功能，
    所以要寫購物車的 api，這樣才能把商品加入購物車，
    還有訂單頁 order 的 api，
    購物車要存在 user，所以到 back/routes/user.js，增加使用者購物車的路由
-->
<!-- 建立商品卡 (productCard.vue) :在這個 component 中，定義商品的展示樣式和 "加入購物車" 的功能。
    使用 addCart 方法來將商品添加到購物車中，並發送請求到後端 -->
<template>
    <v-card
      :disabled="loading"
      :loading="loading"
      class="mx-auto my-12"
      min-width="374"
      max-width="374"
    >
      <!-- loader 是 slot 名稱、isActive 是從父組件傳入的屬性，表示進度條的狀態 -->
      <template v-slot:loader="{ isActive }">
        <!-- v-progress-linear 線性進度條，進度條的狀態取決於 isActive，當 true 時顯示運行 -->
        <!-- :active="isActive" 控制進度條是否顯示 -->
        <!-- indeterminate 不確定模式，即會持續運行，不會停止 -->
        <v-progress-linear
          :active="isActive"
          color="#D78A24"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <!-- 0717 01:14:00
          在 v-img 外面加上 router-link
          圖片 image ，
          記得要綁定 :src=""
          設定圖片寬、高
          -->
      <router-link :to=" '/products/' + _id " class="no-underline">
        <v-img
        height="250"
        :src="image"
        cover
        ></v-img>
      </router-link>

      <v-card-item>
        <router-link :to=" '/products/' + _id " class="no-underline">
          <v-card-title class="a-custom">
            <!-- 0717 01:13:05
                這裡把做好的 products/[id].vue 放進來 router-link 中
                記得要綁定 :to=""
                注意這裡是 products，因為資料夾叫做 products
            -->
            {{ name }}
          </v-card-title>
        </router-link>

        <!-- 針對 category 去綁定分類 -->
        <v-card-title>
          <span  class="me-1">{{ category }}</span>
        </v-card-title>

        <v-card-subtitle>
          <!-- 0717 01:15:12 如果使用 white-space: pre 會導致無法換行 -->
          <span class="me-1">{{ description }}</span>
          <v-icon
            color="#D78A24"
            icon="mdi-fire-circle"
            size="small"
          ></v-icon>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-row
          class="mx-0"
        >
          <!-- v-rating 一個評分控件 -->
          <!-- :model-value 設置評分的值為 4.5 -->
          <!-- half-increments 啟用半星評分，允許顯示半顆星 -->
          <!-- readonly 設置評分控件為只讀狀態，不能進行交互 -->
          <v-rating
            :model-value="4.5"
            color="amber"
            density="compact"
            size="small"
            half-increments
            readonly
          ></v-rating>

          <div class="text-grey ms-4">
            4.5 (413)
          </div>
        </v-row>
        <div class="my-4 text-subtitle-1">
          ${{ price }}
        </div>
      </v-card-text>

      <v-divider class="mx-4 mb-1"></v-divider>

      <v-card-title class="v-card-title-text">客製化口味</v-card-title>
      <div class="px-4 mb-2">
      <v-chip-group multiple column>
        <v-chip
          v-for="(item, index) in customizationsList"
          :key="index"
          :class="{ 'bg-y': item.selected }"
          @click="toggleChip(index)"
        >
          {{ item.label }}
          <v-select
            v-if="item.type === 'select'"
            v-model="item.value"
            :items="item.options"
            label="選擇辣度"
            class="ml-2"
            dense
          />
          <v-checkbox
            v-else
            v-model="item.value"
            class="hidden-checkbox"
          />
        </v-chip>
      </v-chip-group>
    </div>

      <v-card-actions>
        <v-btn
          color="#D78A24"
          text="addCart"
          block
          hover
          @click="addCart"
          :loading="loading"
        ></v-btn>
      </v-card-actions>
    </v-card>
</template>

<script setup>
  // 0717 02:20:45
  // 加入 UI 的效果，設定 loading 效果
  import { ref } from 'vue'
  // 0717 02:17:30 
  // 寫 "加入購物車" 的功能 v-btn，引用完成記得要 const
  import { useUserStore } from '@/stores/user.js'
  // 0717 02:17:40
  // 引用 route，使用有 r 的路由，有動作，
  // 例如跳轉頁面(如果使用者沒有登入的話，點 "加入購物車" 就會把使用者丟到登入頁面)。
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
    // 0717 00:53:00
    // 定義元件的 props 接收的資料，使用 defineProps，且不用 import
    // 0717 00:55:45 都定義完成以後，就可以引用到 menu.vue 頁面上使用了

    // 0717 02:19:00 加上 const props = defineProps
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
    
  // 定義 useUserStore
  const user = useUserStore()
  const router = useRouter()
  const createSnackbar = useSnackbar()

  const spicyLevel = ref('不辣')
  const spicyLevels = ['不辣', '微辣', '小辣', '中辣', '大辣']

  const customizationsList = ref([
  { label: '加辣', type: 'select', value: spicyLevel, options: spicyLevels, selected: spicyLevels[0] },
  { label: '加蛋 +15', type: 'checkbox', value: false, selected: false },
  { label: '加飯 +15', type: 'checkbox', value: false, selected: false },
  { label: '加沙茶 +15', type: 'checkbox', value: false, selected: false },
  { label: '加料 +45', type: 'checkbox', value: false, selected: false },
])

  // 設定加載狀態: 定義 loading，當點 "addCart" 時，loading.value = true，跑完 2 秒之後 loading.value = false。
  const loading = ref(false)

  // toggleChip 的作用是當某個項目被點擊時，切換該項目的選擇狀態（從選中到未選中或從未選中到選中）
  const toggleChip = (index) => {
    customizationsList.value[index].selected = !customizationsList.value[index].selected
  }

  // 0717 02:18:15
  // 執行 addCart 方法: 
  const addCart = async () => {
    // 檢查使用者是否已經登入
    // 如果使用者 !isLogin 就把使用者丟到 '/login'
    if (!user.isLogin){
      router.push('/member')
      return
    }
    // 0717 02:19:00 上面加上 const props = defineProps
    // 數量固定為 1，再去加上 const result =... 在前面
    // 對照 login 的寫法 (pages/login.vue .... const result = await user.login(values))
    loading.value = true

    // customizationsList 是一個包含所有自定義選項的數組，每個選項都有 label、type、value 和 selected 屬性。
    // reduce 方法會遍歷 customizationsList 中的每個項目，並將它們的 label 和 value 存儲到 acc 這個累加器對象中。
    // 最終結果是一個 customizationsData 對象，其中每個鍵是自定義選項的 label，而每個值是相應的 value。
    const customizationsData = customizationsList.value.reduce((acc, item) => {
      acc[item.label] = item.selected
      return acc
    }, {})

    // 調用 user.addCart 方法 :
    // 將商品 ID (props._id)、數量 (1)、客製化選項 (customizationsData) 傳送到後端。
    // props._id：商品的唯一標識符 (ID)。
    // 1：商品的數量，這裡固定為1。
    const result = await user.addCart(props._id, 1, customizationsData)
    // 對照 stores/user.js 的 result 回傳的值
    // if (result === '加入購物車成功')
    // 加上 snackBars 的訊息
    createSnackbar({
    text: result.text,
    snackbarProps: {
      color: result.color
    }
  })
  // 0717 02:22:15
  // 確認購物車是否可以正常新增商品進去
  loading.value = false
  }
  // 0717 02:21:00
  // 定義 loading，當點 "addCart" 時，loading.value = true，跑完 2 秒之後 loading.value = false。
  // 綁定到 v-btn 上面
  setTimeout(() => {
    loading.value = false
  }, 2000)

</script>

<style scoped lang="scss">
  .v-chip-group {
    display: flex;
    flex-direction: column;
  }
  .v-chip {
    display: flex;
    align-items: center;
    margin-bottom:12px; /* 增加項目間距 */
  }
  .a-custom {
    font-size: 22px;
    font-weight: bolder;
    color: #D78A24;
  }
  .v-card-title-text{
    font-size: 18px;
    font-weight: 500;
    color: #D78A24;
  }
  .v-card{
    padding: 0;
    margin: 0;
  }
  a {
    text-decoration: none;
  }
  .bg-y{
    background-color: #D78A24;
    color: white;
  }
  .ml-2 {
    margin-left: 8px;
  }
  .hidden-checkbox {
    display: none;
  }
</style>