import { Schema, model, ObjectId } from 'mongoose'

// 0717 03:10:35
// 把結帳的功能做完，從後端 orders 開始完成訂單，跟使用者差不多
// cartSchema 會員購物車資訊

// 0717 03:16:15
// 先處理 index.js order的路由、routes/order.js、再建立 controllers/order.js
const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products', // 代表資料庫的 collection
    required: [true, '即時點餐商品購物車必填']
  },
  quantity: {
    type: Number,
    required: [true, '即時點餐商品購物車數量必填'],
    min: [1, '即時點餐商品購物車數量不得小於 1']
  },
  customizations: {
    // Map 對象
    type: Map,
    // of: 用於指定 Map 中值的數據類型。
    // Schema.Types.Mixed: 表示這個字段可以包含任何類型的數據。
    of: Schema.Types.Mixed,
    // {}: 表示 customizations 字段的默認值是一個空的 Map 對象。
    default: {}
  }
})

// order 主要提供給店家看會員的訂單狀況
const schema = new Schema({
  // 會員 id，ref 引入 users 的 user_id
  user: {
    // 誰的訂單
    type: ObjectId,
    // 跟 users 這個 collection 關聯
    ref: 'users',
    required: [true, '訂購人必填']
  },
  // 因為 cartSchema 沒有另外建立一個檔案，
  // 所以會直接把 cartSchema 寫在檔案上面
  cart: {
    type: [cartSchema], // 一定要中括號 [ ]
    validate: { // 使用 mongoose 內建 validate 驗證
      validator (value) {
        return value.length > 0 // 購物車數量不能小於 0
      },
      message: '即時餐點購物車商品必填'
    }
  },
  // 訂單狀態 status
  status: {
    type: String,
    enum: ['pending', 'in-process', 'completed', 'canceled'],
    // 訂單都是預設 pending 狀態
    default: 'pending'
  },
  // 增加 totalAmount 欄位來記錄總金額
  totalAmount: {
    type: Number,
    default: 0,
    required: [true, '總金額必填']
  }
}, {
  timestamps: true, // 建立日期
  versionKey: false // 不需要 __v 欄位
})

export default model('orders', schema)
