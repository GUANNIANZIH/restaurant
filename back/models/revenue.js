// InOut.js 將存儲具體的交易數據（如收入、支出等）
// 與 ItemCategory.js 關聯。
import { Schema, model } from 'mongoose'

// 設定 type 中的 enum 值
// 這裡設定為一個物件，並且使用 Object.values(transactionTypes) 方法
// 獲取作為 enum 驗證。
// 確保 typeField 的值只能是 transactionTypes 对象中的其中一个值。
const transactionTypes = {
  REVENUE: '當日營業額收入',
  PURCHASE_EXPENSE: '當日進貨支出',
  OTHER_EXPENSE: '當日其他支出',
  OTHER_INCOME: '當日其他收入',
  INITIAL_CAPITAL: '當日開店本金'
}

const schema = new Schema({
  itemName: {
    type: String,
    required: [true, '登記項目名稱必填']
  },
  quantity: {
    type: Number, // 進貨數量
    required: [true, '項目數量必填'],
    min: [1, '商品數量不得小於1']
  },
  date: {
    type: Date,
    required: [true, '交易日期必填']
  },
  // price: {
  //   type: Number, // 進貨價格
  //   required: [true, '商品價格必填'],
  //   min: [1, '商品價格不得小於1']
  // },
  typeField: {
    type: String,
    // enum: ['當日營業額收入', '當日進貨支出', '當日其他支出', '當日其他收入', '當日開店本金']
    // Object.values() 是 JavaScript 的一個內建方法，
    // 用於獲取對象所有屬性的值，並以數組的形式返回這些值。
    enum: Object.values(transactionTypes),
    required: [true, '交易類型必填']
  },
  totalAmount: {
    type: Number,
    required: [true, '總金額必填'],
    // 使用 mongoose validate 來自訂驗證規則
    validate: {
      validator: function (value) {
        const { typeField } = this

        if (typeField === transactionTypes.REVENUE || typeField === transactionTypes.OTHER_INCOME) {
          return value >= 0 // 收入類型，總金額必須是正數
        } else if (
          typeField === transactionTypes.PURCHASE_EXPENSE ||
          typeField === transactionTypes.OTHER_EXPENSE ||
          typeField === transactionTypes.INITIAL_CAPITAL
        ) {
          return value <= 0 // 支出類型，總金額必須是負數
        }
        return true // 其他情況不做特別驗證
      },
      message: function (props) {
        const { typeField } = props.instance || {}

        if (!typeField) {
          return '無效的交易類型'
        }

        if (typeField === transactionTypes.REVENUE || typeField === transactionTypes.OTHER_INCOME) {
          return `總金額應為正數，當前值為 ${props.value}`
        } else {
          return `總金額應為負數，當前值為 ${props.value}`
        }
      }
    }
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model('revenues', schema)
