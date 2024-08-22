import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRoles.js'
// 另外寫了一個 "會員訂單紀錄" 方便之後抓取資料，
// 直接從 order 裡面的 cart 去計算?
// import orderSchemas from './orderSchema.js'

// Regex 定義手機號碼的正則表達式驗證模式
const phoneNumberRegex = /^[0][0-9]{9}$/

// 如果需要添加 products，則操作 cartSchema 欄位
// 有 user 才有 cart，所以把 cartSchema 存在 user.js
const cartSchema = new Schema({
  // ref 引入 products 的 p_id
  p_id: {
    // ObjectId 是 MongoDB 中用於唯一標識文檔的類型。
    // 每個文檔都有一個唯一的 _id 欄位，這個欄位的數據類型為 ObjectId。
    // p_id 欄位中的 ObjectId 將參考 products 集合中的某個文檔。
    type: ObjectId,
    required: [true, '即時點餐商品購物車必填'],
    ref: 'products' // 代表資料庫的 collection
  },
  quantity: {
    type: Number,
    required: [true, '即時點餐商品購物車數量必填'],
    min: [1, '即時點餐商品購物車數量不得小於 1']
  },
  // 增加 customizations 處理客製化商品需求
  // 你灵活地存储不同类型的定制选项。
  customizations: {
    type: Map,
    of: String,
    default: {}
  }
})

// 如果需要添加 specialty，則操作 cartSpecialtySchema 欄位
const cartSpecialtySchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'specialties',
    required: [true, '預購私廚商品購物車必填']
  },
  quantity: {
    type: Number,
    required: [true, '預購私廚商品購物車數量必填'],
    min: [1, '預購私廚商品購物車數量不得小於 1']
  }
})

const schema = new Schema({
  account: {
    type: String,
    require: [true, '會員帳號必填'],
    minlength: [6, '會員帳號最少6個字元'],
    maxlength: [16, '會員帳號最多16個字元以內'],
    unique: true,
    // mongoose 的自定義驗證 validate 物件
    validate: {
      // 使用 validator 套件的 isAlphanumeric 方法驗證
      validator (value) {
        // .isAlphanumeric 檢查字符串是否僅包含字母和數字字符（沒有任何其他符號或空格）
        return validator.isAlphanumeric(value)
      },
      // 回傳錯誤訊息
      message: '會員帳號格式錯誤'
    }
  },
  // password 加密另外驗證 bcrypt，schema.pre
  password: {
    type: String,
    required: [true, '會員密碼必填']
  },
  // 自動綁定手機賴? 電話? e-mail?
  phoneNumber: {
    type: String,
    required: [true, '會員手機必填'],
    match: [phoneNumberRegex, '手機號碼格式不正確'],
    trim: true
  },
  // 新增 products 的購物車欄位
  cart: {
    type: [cartSchema]
  },
  // 新增 specialty 的購物車欄位
  cartSpecialties: {
    type: [cartSpecialtySchema]
  },
  // 儲存與用戶相關的多個 tokens
  // 搭配 " jsonwebtoken" 用於生成和驗證 JSON Web Tokens (JWT)
  // 例如: 每次用戶登入時，可以生成一個新的 JWT 並儲存在 tokens 陣列中。
  // 或是: 用戶可能需要存儲與第三方服務相關的 tokens，例如 OAuth 認證服務的 tokens。
  // 或是: 應用支持多設備登入，用戶可能會有多個設備，每個設備都有自己的 tokens。
  tokens: {
    type: [String]
  },
  role: {
    type: Number,
    // 預設為 USER
    default: UserRole.USER
  },
  // 紀錄會員累積消費
  totalSpent: {
    type: Number,
    default: 0,
    required: [true, '會員消費累計必填']
  },
  // 紀錄會員累積點數
  totalPoint: {
    type: Number,
    default: 0,
    required: [true, '會員消費累計必填']
  }
}, {
  // timestamps: true, 告訴 Mongoose 自動為每個文檔添加 createdAt 和 updatedAt 欄位。
  // 記錄文檔的創建時間和最後一次更新時間。
  timestamps: true,
  // 關閉 __v 的欄位，__v 是 Mongoose 用來跟踪文檔版本的。
  versionKey: false
}
)

// password 加密動作
// 進入資料庫 save 前的操作
// 不能使用 arrow function，this 代表資料
schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 6 || user.password.length > 16) {
      // Error.ValidationError() Error 來自 mongoose， 手動新增 mongoose 錯誤訊息
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidationError({ message: '密碼最少輸入6字元，最多輸入16字元' }))
      // 繼續下一步，帶出錯誤
      next(error)
      return
    } else {
      // 確認格式正確後進行加密 bcrypt、add salt 10 次
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

// 0709/ 00:59:30
// 'cartQuantity' 使用 .virtual 去計算 user.cart 的累積數量顯示
// 為虛擬欄位，是函式所產生的欄位
schema.virtual('cartQuantity').get(function () {
  const user = this
  return user.cart.reduce((total, current) => {
    return total + current.quantity
  }, 0)
})

schema.virtual('cartSpecialtyQuantity').get(function () {
  const user = this
  return user.cartSpecialties.reduce((total, current) => {
    return total + current.quantity
  }, 0)
})

export default model('users', schema)
