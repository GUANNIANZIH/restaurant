import { Schema, model, ObjectId } from 'mongoose'

const cartSpecialtySchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'specialties', // 代表資料庫的 collection
    required: [true, '預購私廚商品購物車必填']
  },
  quantity: {
    type: Number,
    required: [true, '預購私廚商品購物車數量必填'],
    min: [1, '預購私廚商品購物車數量不得小於 1']
  }
})

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: [true, '訂購人必填']
  },
  cartSpecialties: {
    type: [cartSpecialtySchema],
    validate: {
      validator (value) {
        return value.length > 0
      },
      message: '預購私廚購物車商品必填'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in-process', 'completed', 'canceled'],
    default: 'pending'
  },
  // 增加 totalAmount 欄位來記錄總金額
  totalAmount: {
    type: Number,
    default: 0,
    required: [true, '總金額必填']
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model('orderSpecialties', schema)
