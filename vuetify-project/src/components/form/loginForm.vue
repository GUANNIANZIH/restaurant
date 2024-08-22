<template>
    <!-- 登入 tab -->
    <v-tabs-window-item :value="2">
      <v-card class="d-flex flex-column align-center justify-content-center">
        <v-sheet
          class="pa-4 text-center mt-5 mb-5"
          max-width="600"
          rounded="lg"
          width="100%"
        >
        <!-- 只需要帳號、密碼 -->
        <!-- 使用 label 定義欄位名稱、設定輸入最少/多字元數、counter 可計算輸入到第幾個字元-->
        <!-- 使用 v-model 綁定 useField('account')、useField('password') -->
        <!-- v-model="account.value.value" -->
        <!-- :disabled="isSubmitting" 如果表單送出就停用，避免使用者一直點 -->
        <!-- @submit.prevent="submit" 當送出表單時要 prevent = submit，使用自定義 function (submit)，
        使用這個 submit 去呼叫 handleSubmit 的東西，像是前面綁定 v-form 停用狀態 (:disabled="isSubmitting")、loading 狀態 (:loading="isSubmitting") -->
            <v-form :disabled="isSubmitting" @submit.prevent="submit">
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
              counter
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
              ></v-text-field>
              <!-- v-btn 記得要加上 type="submit"，且一定要在 v-form 的功能，才會有 submit -->
              <!-- v-btn 綁定 loading 狀態是送出中(轉圓圈效果)，:loading="isSubmitting" -->
              <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting">Login | 登入</v-btn>
              <v-spacer/>
              <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting">LINE 帳號登入</v-btn>
            </v-form>
        </v-sheet>
      </v-card>
    </v-tabs-window-item>
</template>

<script setup>
import { ref } from 'vue'
// vee-validate 套件搭配 yup 套件驗證表單，做 v-form 表單驗證。
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
// 用來驗證電話號碼格式、email 格式等等。
import validator from 'validator'; 
// 路由做跳頁- 因為登入後會跳到首頁，所以這裡我要註冊、登入都跳到首頁?
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js';
// snackbar 顯示成功、失敗，記得要要先做 "套件安裝前置設定動作"
import { useConfirm, useSnackbar } from 'vuetify-use-dialog';


// 最後拿掉 useApi，因為將使用者登入後的資料，放在 Pinia 的 user.js 裡面，所以不需要發送 "登入的請求 api"
// import { useApi } from '@/composables/axios';
// 引入 composables/axios.js 的 useApi，用來發送請求，完全照 Vue use api 的風格。
// { useApi } 是一個 function，所以要呼叫他才能使用，因為登入要送 api
// 0709/02:28:05

// 使用 useApi() 來取得 api，這樣就可以使用 api.get()、api.post() 等等
// 類似寫 useDisplay() 來取得 mobile
// const { api } = useApi()

const router = useRouter()
const user = useUserStore()
// 0709/ 03:19:50
// snackbar、confirm 進行引用，再去修改 loginCard.vue 裡面的 UX 體驗
const createConfirm = useConfirm()
const createSnackbar = useSnackbar()

const tabs = ref(1)
const successDialog = ref(false);
const failureDialog = ref(false);

// 使用 yub.object 去定義，代表 schema 變數是一個物件型態，裡面去定義物件的各種屬性
// 物件的東西根據 v-form 有甚麼欄位就去定義有甚麼欄位，取的跟後端 models/user.js 一樣比較方便
// 裡面可以設定錯誤訊息在後面
const schema = yup.object({
account: yup
.string()
.min(6, '會員帳號最少6個字元')
.max(16, '會員帳號最多16個字元以內')
.required('會員帳號必填')
.test('isAlphanumeric', '請輸入英文或數字', value => {
  return validator.isAlphanumeric(value)
}),
password: yup
.string()
.min(6, '會員密碼最少6個字元')
.max(16, '會員密碼最多16個字元以內')
.required('會員密碼必填')
})

// 要先 useform 後才能使用 useField，如果反過來 usefield 會找不到 useForm
// 使用 useForm 去驗證表單
// 解構 handleSubmit (處理送出表單的動作), isSubmitting (判斷表單是否在送出中，在上面 v-form 用到)
// 通常表單送出時會把表單給停用，避免使用者重複送出
const { handleSubmit, isSubmitting } = useForm({
// 設定表單的驗證是上面的 schema
validationSchema: schema
})

// 建立各個欄位，上面所建立的 schema 有哪些欄位就要建立哪些欄位，
// useField 裡面的參數是要跟 schema 的 key 一樣
const account = useField('account')
const password = useField('password')

// 0709/ 02:14:00
// 登入以後要去把 token 資料都存在 Pinia 裡面，這樣就可以在任何地方都可以取得 token，
// 所以要去定義 stores，就是定義 Pinia 的結構

// 0709/ 02:14:30
// 這次的 stores 寫法不同，使用 setup store，之前 Pomodoro 是使用 options stores 寫法(actions, state, getters)
// 但其實可以使用 setup store 寫法.... 去 stores/app.js 看 (檔名從 app.js 改為 user.js，並將裡面的 app 改為 user)

// 0709/ 02:37:15 回來 pages/member.vue 去寫 "登入" 的東西.......，前面先到 stores/user.js 去寫登入的東西
// 綁定 handleSubmit, isSubmitting 到上面的 v-form、v-btn

// 0709/ 02:39:10
// 使用上面 v-form 使用的 submit 去呼叫 handleSubmit 的東西，像是前面綁定 v-form 停用狀態 (:disabled="isSubmitting")、loading 狀態 (:loading="isSubmitting")
// 從 useForm 拉出來的東西，當發生送出事件時，會執行這個 submit 函式，是一個 async function，
// 裡面放 (values) 跟註冊一樣，是表單各欄位的值，(直接拉 stores/user.js 的東西進來)，就可以直接呼叫 user 變數
// 註冊後導向登入頁面，解構路由去做跳頁
const submit = handleSubmit(async (values) => {
  const result = await user.login(values)
  // 如果 "登入成功"，就導向首頁 (對應 stores/user.js 的 login function... return '登入成功')
  // 可以看 "Network" 的 Preview，看到 result 登入成功的傳入的陣列 (0719/ 02:41:40)
  if (result === '登入成功') {
    // .push('/') 是導向首頁
    // 0709/ 03:20:00 增加 snackbar 的視窗使用，可以修改顯示的顏色
    createSnackbar({
      // 0709/ 03:29:20
      // 顯示的文字可以直接改成 result，因為 result 是 '登入成功'
      text: result,
      // 0709/ 03:22:00
      // 設定傳入的 props
      snackbarProps: {
        color: '#3C5D44'
      }
    })
    // 註冊成功後導向首頁，路由跳轉
    router.push('/')
  } else {
    // 登入失敗，原本暫時顯示 result 的結果，錯誤訊息
    // alert(result)
    createSnackbar({
      // 顯示的文字
      text: result,
      // 0709/ 03:22:00
      // 設定傳入的 props
      snackbarProps: {
        color: '#D78A24'
      }
    })
  }
  // 0709/ 02:42:00 完成後，要開始做 UX 功能的優化，因為剛剛很多功能都是暫時寫，還要回去修正 UX 部分的體驗
  // 先確認 API 登入功能為正常的，再來做 UX 優化
})
</script>

<style scoped>

.v-col{
padding: 0;
}

</style>