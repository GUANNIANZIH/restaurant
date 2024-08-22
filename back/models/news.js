import { Schema, model } from 'mongoose'

// announcement 主要提供給店家發布公告
// 注意 title, subtitle, content, isPublished 這幾欄位跟 product 的欄位不一樣。
const schema = new Schema({
  title: {
    type: String,
    required: [true, '公告標題必填']
  },
  subtitle: {
    type: String
  },
  content: {
    type: String,
    required: [true, '公告內容必填']
  },
  image: {
    // URL 路徑
    // 圖片 URL 或路徑通常是以字符串的形式儲存的
    type: String,
    required: [true, '活動消息圖片必填']
  },
  category: {
    type: String,
    required: [true, '文章種類必填'],
    enum: {
      values: ['新品上市', '店休公告', '會員活動'],
      message: '文章分類錯誤，查無 "{VALUE}" 分類'
    }
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model('news', schema)
