// 分類：可以添加 category 欄位來管理商品分類。
// 價格：添加 price 欄位來記錄商品的價格。
// 庫存：添加 stock 欄位來跟蹤每個商品的庫存數量。
import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱必填']
  },
  price: {
    type: Number,
    required: [true, '商品價錢必填']
  },
  image: {
    // URL 路徑
    // 圖片 URL 或路徑通常是以字符串的形式儲存的
    type: String,
    required: [true, '商品圖片必填']
  },
  description: {
    type: String,
    required: [true, '商品說明必填'],
    minlength: [8, '最少輸入8字元商品說明描述'],
    maxlength: [24, '最多輸入24字元商品說明描述']
  },
  category: {
    type: String,
    required: [true, '商品分類必填'],
    enum: {
      values: ['炒飯 | Fried Rice', '炒麵 | Fried Noodles', '湯麵 | Soup Noodles', '炒米粉 | Fried Vermicelli', '湯米粉 | Soup Vermicelli', '湯品 | Soup', '小品 | Dishes', '新品上市'],
      message: '商品分類錯誤，查無 "{VALUE}" 分類'
    }
  },
  // 是否上架
  sell: {
    type: Boolean,
    required: [true, '商品上架狀態必填']
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model('products', schema)
