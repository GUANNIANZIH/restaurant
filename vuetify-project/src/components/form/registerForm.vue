<template>
      <v-tabs-window-item :value="1">
        <v-card class="d-flex flex-column align-center justify-content-center">
          <v-sheet
          class="pa-4 text-center mt-5 mb-5"
          max-width="600"
          width="100%"
        >
        <!-- 註冊 tab -->
        <!-- 把下面建立好的欄位 schema 綁上來 v-model-->
            <!-- 在 form 上面寫當表單送出時，@submit.prevent="submit" -->
            <!-- isSubmitting 是從 useForm 拉出來的東西，送出時停用 -->
            <v-form @submit.prevent="submit" :disabled="isSubmitting">
              <!-- v-model="account.value.value -->
              <!-- 因為 account 是一個由 ref 或 reactive 建立的響應式物件 -->
              <!-- error-messages 是 Vue 3 的一個綁定屬性，
              用於綁定錯誤訊息到某個表單元素（如 <v-text-field>） -->
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
              ></v-text-field>
              <!-- v-btn 有 :loading 的屬性可以用，控制會不會有圓圈 -->
              <!-- 綁定 isSubmitting 這樣送出時會有轉圈樣子-->
              <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting" @click="dialog = !dialog">Register | 註冊</v-btn>
              <v-spacer/>
              <v-btn type="submit" class="mb-5 w-50" :loading="isSubmitting" @click="dialog = !dialog">LINE 帳號註冊</v-btn>
            </v-form>
        </v-sheet>
        </v-card>
      </v-tabs-window-item>
</template>

<script setup>
// defineEmits 發射事件，emit 接收事件
import { ref } from 'vue'
 // vee-validate 套件搭配 yup 套件驗證表單，做 v-form 表單驗證。
 import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
// 用來驗證電話號碼格式、email 格式等等。
import validator from 'validator'; 
// 路由做跳頁- 因為登入後會跳到首頁，所以這裡我要註冊、登入都跳到首頁?
import { useRouter } from 'vue-router'
// 引入 composables/axios.js 的 useApi，用來發送請求，完全照 Vue use api 的風格。
// { useApi } 是一個 function，所以要呼叫他才能使用，因為登入要送 api
import { useApi } from '@/composables/axios';
// snackbar 顯示成功、失敗，記得要要先做 "套件安裝前置設定動作"
import { useConfirm, useSnackbar } from 'vuetify-use-dialog';


// 使用 useApi() 來取得 api，這樣就可以使用 api.get()、api.post() 等等
// 類似寫 useDisplay() 來取得 mobile
const { api } = useApi()
// defineEmits 發射事件，emit 接收事件
const emit = defineEmits(['registerSuccess']);
const router = useRouter()
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
  .required('會員密碼必填'),
  phoneNumber: yup
  .string()
  .min(10, '會員電話號碼最少10個字元')
  .max(10, '會員電話號碼最多10個字元以內')
  .required('會員電話號碼必填')
  // .test(自訂驗證名稱, '錯誤訊息', value => { return validator.isMobilePhone(value, 'zh-TW') })
  .test('is-phoneNumber', '請輸入正確的電話號碼格式', value => {
    return validator.isMobilePhone(value, 'zh-TW')
  // 如果使用 .oneOf(陣列, 錯誤訊息) 只允許符合陣列內其中一個值
  // .ref('password') 代表要跟 password 欄位比對是否一樣
  })
})

// 使用 useForm 去驗證表單
// 解構 handleSubmit (處理送出表單的動作), isSubmitting (判斷表單是否在送出中，在上面 v-form 用到)
// 通常表單送出時會把表單給停用，避免使用者重複送出
const { handleSubmit, isSubmitting } = useForm({
  // 設定表單的驗證是上面的 schema
  validationSchema: schema
})

// 要先 useform 後才能使用 useField，如果反過來 usefield 會找不到 useForm
// 建立各個欄位，上面所建立的 schema 有哪些欄位就要建立哪些欄位，useField 裡面的參數是要跟 schema 的 key 一樣
const account = useField('account')
const password = useField('password')
const phoneNumber = useField('phoneNumber')

// 從 useForm 拉出來的東西，當發生送出事件時，會執行這個 submit 函式
// (value) 是表單各欄位的值
// 註冊後導向登入頁面，解構路由去做跳頁
const submit = handleSubmit(async (values) => {
  try {
    await api.post('/user',{
      account: values.account,
      password: values.password,
      phoneNumber: values.phoneNumber
    })
    // 0709/ 03:30:15
    createSnackbar({
      // 顯示的文字
      text: '註冊成功',
      // 0709/ 03:22:00
      // 設定傳入的 props
      snackbarProps: {
        color: '#3C5D44'
      }
    })
    // 註冊成功後導向登入頁面，路由跳轉
    emit('registerSuccess')
    router.push('/member')
  } catch (error) {
    console.log(error)
    // alert(error.response.data.message || '發生錯誤')
    createSnackbar({
      // 顯示的文字
      // 0709/ 03:30:50
      text: error.response.data.message || '發生錯誤',
      // 0709/ 03:22:00
      // 設定傳入的 props
      snackbarProps: {
        color: '#D78A24'
      }
    })
  }
})
</script>

<style scoped>

.v-col{
  padding: 0;
}

</style>