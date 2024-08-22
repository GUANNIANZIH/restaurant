import Order from '../models/order.js'
import OrderSpecialty from '../models/orderSpecialty.js'
// 需要使用者相關資訊 ref 關聯
import User from '../models/user.js'
// 狀態碼
import { StatusCodes } from 'http-status-codes'

// 0717 03:22:10
// 只有建立 create 比較麻煩，其他比較簡單
// 要執行 create 新增訂單的話，先登入 auth.jwt, create
// router.post('/', auth.jwt, create)
export const create = async (req, res) => {
  try {
    // req.user 是從 auth.js 的 jwt 驗證取得的
    // 檢查購物車有沒有東西
    if (req.user.cart.length === 0) throw new Error('EMPTY')
    // 檢查有沒有下架商品，跟查詢使用者的購物車一樣，用查詢方式帶出購物車裡面的其他資訊
    // 將購物車中的商品 ID (p_id) 轉換為商品的完整資料。這樣可以檢查購物車中的每個商品是否仍在銷售中。
    // p_id 是產品的 ID，這樣做可以將每個產品的詳細信息（而不僅僅是 ID）加載到結果中。
    const user = await User.findById(req.user._id, 'cart').populate('cart.p_id')
    // 前端使用 .some() 方法來檢查是否有有包含下架商品
    // 這裡使用 .every() 方法來檢查是否全部都是上架商品
    const ok = user.cart.every(item => item.p_id.sell)
    // 如果有下架商品就拋出錯誤
    if (!ok) throw new Error('SELL')

    // ++新增一個計算總價 totalAmount
    // callback(acc, item) 接受兩個參數，acc 是累加器，item 是陣列中的每個元素
    // acc (累加器)：儲存每次計算後的累積值。它會在每次迭代中更新。
    // item (當前元素)：代表當前迭代中的購物車項目，即 req.user.cart 陣列中的每一個元素。
    // 0 是 reduce 的初始值，即 acc 在第一次迭代前的初始值為 0。
    const totalAmount = user.cart.reduce((acc, item) => {
      const price = item.p_id.price
      const quantity = item.quantity
      // 在計算 totalAmount 時，會檢查 price 和 quantity 是否為有效數字。
      // 如果發現任何無效數字，會丟出 INVALID_CART_ITEM 錯誤並返回相應的錯誤訊息。
      if (isNaN(price) || isNaN(quantity)) {
        throw new Error('INVALID_CART_ITEM')
      }
      return acc + price * quantity
    }, 0)

    // 加對 totalSpent 的檢查和處理
    if (isNaN(totalAmount)) {
      throw new Error('INVALID_TOTAL_AMOUNT')
    }

    // 0717 03:27:10
    // 建立訂單，Order 代表上面引入的 order.js
    await Order.create({
      // user: req.user._id 代表使用者的 id
      user: req.user._id,
      // 使用者的購物車
      cart: req.user.cart,
      // ++訂單狀態
      // pending 為預設值
      status: 'pending',
      // 會員的資料中存儲消費紀錄並進行累積:
      // 在每次成功創建訂單後，計算該訂單的總金額並將其加到會員的 totalSpent 中。
      totalAmount
    })

    // 每次創建訂單時更新會員累積消費金額
    // user.totalSpent += totalAmount
    // 這裡不再更新 totalSpent，而是在 calculateTotalSpent 中處理
    user.cart = []
    await user.save()

    // 0717 03:27:30 清空購物車
    req.user.cart = []
    // 保存使用者資訊
    await req.user.save()

    // 回應狀態碼
    // 0717 03:28:00 在寫的東西都只有使用 data, result，但還是需要 success, message 才符合 RESTful API 規範
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
    // 07117 03:28:50 處理上面的錯誤訊息 'EMPTY'、'SELL'這兩個是自定義的錯誤
    // 'ValidationError' 這是 mongoose 的錯誤訊息
  } catch (error) {
    if (error.name === 'EMPTY') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: true,
        message: '購物車是空的'
      })
    } else if (error.name === 'SELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: true,
        message: '包含下架商品'
      })
      // 購物車中包含無效商品
    } else if (error.message === 'INVALID_CART_ITEM') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '購物車中包含無效商品'
      })
      // 總金額計算錯誤
    } else if (error.message === 'INVALID_TOTAL_AMOUNT') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '總金額計算錯誤'
      })
      // 驗證錯誤問題
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
      // 未知伺服器錯誤
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const createSpecialty = async (req, res) => {
  try {
    console.log('檢查購物車是否為空:', req.user.cartSpecialties)
    if (req.user.cartSpecialties.length === 0) throw new Error('EMPTY')

    const user = await User.findById(req.user._id, 'cartSpecialties').populate('cartSpecialties.p_id')
    console.log('購物車中的商品詳細信息:', user.cartSpecialties)

    const ok = user.cartSpecialties.every(item => item.p_id.sell)
    console.log('所有商品是否仍在銷售中:', ok)
    // 如果有下架商品就拋出錯誤
    if (!ok) throw new Error('SELL')

    await OrderSpecialty.create({
      user: req.user._id,
      cartSpecialties: req.user.cartSpecialties
    })

    user.cartSpecialties = []
    await user.save()

    // 0717 03:27:30 清空購物車
    req.user.cartSpecialties = []
    // 保存使用者資訊
    await req.user.save()

    // 回應狀態碼
    // 0717 03:28:00 在寫的東西都只有使用 data, result，但還是需要 success, message 才符合 RESTful API 規範
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
    // 07117 03:28:50 處理上面的錯誤訊息 'EMPTY'、'SELL'這兩個是自定義的錯誤
    // 'ValidationError' 這是 mongoose 的錯誤訊息
  } catch (error) {
    if (error.name === 'EMPTY') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: true,
        message: '購物車是空的'
      })
    } else if (error.name === 'SELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: true,
        message: '包含下架商品'
      })
      // 購物車中包含無效商品
    } else if (error.message === 'INVALID_CART_ITEM') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '購物車中包含無效商品'
      })
      // 總金額計算錯誤
    } else if (error.message === 'INVALID_TOTAL_AMOUNT') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '總金額計算錯誤'
      })
      // 驗證錯誤問題
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
      // 未知伺服器錯誤
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 0717 03:32:55
// get 會員取得自己的訂單
// router.get('/', auth.jwt, get)
export const get = async (req, res) => {
  try {
    // 'cart.p_id': 這個方法用來關聯 cart 陣列中的每個項目中的 p_id 欄位。
    // cart 欄位裡面有裡個欄位 p_id、quantity
    const result = await Order.find({ user: req.user._id }).populate('cart.p_id')
    res.status(StatusCodes.OK).json({
      // 回應茶道的結果 result
      success: true,
      message: '',
      result
    })
  } catch (error) {
    // 可能會發生伺服器錯誤
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getSpecialty = async (req, res) => {
  try {
    const result = await OrderSpecialty.find({ user: req.user._id }).populate('cartSpecialties.p_id')
    res.status(StatusCodes.OK).json({
      // 回應茶道的結果 result
      success: true,
      message: '',
      result
    })
  } catch (error) {
    // 可能會發生伺服器錯誤
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getAllOrderProgress = async (req, res) => {
  try {
    const result = await Order.find()
      // .skip((page - 1) * itemsPerPage)
      // .limit(itemsPerPage)
      .populate('user', 'account') // 取出使用者 user (對應 models/order.js 的 user 欄位) 的 account 欄位
      .populate('cart.p_id') // 還要取出 cart 裡面的 p_id 欄位

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 0717 03:33:45 管理者可以取得所有顧客的訂單
// router.get('/all', auth.jwt, admin, getAll)
export const getAll = async (req, res) => {
  try {
    // const page = req.query.page * 1 || 1
    // const itemsPerPage = req.query.itemsPerPage * 1 || 5
    // 取所有 Order.find() 不需要條件: 使用 Mongoose 的 find 方法從 Order 集合中檢索所有訂單。這會返回一個包含所有訂單的數組。
    // populate 方法用來填充與 Order 模型中的 user 欄位相關的資料。
    // 從 User 模型中檢索並只返回 account 欄位。

    // .populate('cart.p_id'): 這個方法用來關聯 cart 陣列中的每個項目中的 p_id 欄位。
    // 這假設 cart 是 Order 模型中的一個欄位，其中包含與 Product 模型關聯的項目。
    // p_id 是產品的標識符，這樣你可以取得關聯的產品資料，而不是僅僅取得 p_id
    const result = await Order.find()
      // .skip((page - 1) * itemsPerPage)
      // .limit(itemsPerPage)
      .populate('user', 'account') // 取出使用者 user (對應 models/order.js 的 user 欄位) 的 account 欄位
      .populate('cart.p_id') // 還要取出 cart 裡面的 p_id 欄位
      // 只返回 orderNumber、user、createdAt、cart、totalSpent、status 欄位
      // 這樣返回的資料會包含 "訂單編號、會員帳號、下單日期、訂購商品、訂購金額、訂單狀態" 等欄位。
      // .select('orderNumber createdAt totalSpent status')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getAllSpecialty = async (req, res) => {
  try {
    // 取所有 Order.find() 不需要條件: 使用 Mongoose 的 find 方法從 Order 集合中檢索所有訂單。這會返回一個包含所有訂單的數組。
    // populate 方法用來填充與 Order 模型中的 user 欄位相關的資料。
    // 從 User 模型中檢索並只返回 account 欄位。

    // .populate('cart.p_id'): 這個方法用來關聯 cart 陣列中的每個項目中的 p_id 欄位。
    // 這假設 cart 是 Order 模型中的一個欄位，其中包含與 Product 模型關聯的項目。
    // p_id 是產品的標識符，這樣你可以取得關聯的產品資料，而不是僅僅取得 p_id
    const result = await OrderSpecialty.find()
      .populate('user', 'account') // 取出使用者 user (對應 models/order.js 的 user 欄位) 的 account 欄位
      .populate('cartSpecialties.p_id') // 還要取出 cart 裡面的 p_id 欄位
      // 只返回 orderNumber、user、createdAt、cart、totalSpent、status 欄位
      // 這樣返回的資料會包含 "訂單編號、會員帳號、下單日期、訂購商品、訂購金額、訂單狀態" 等欄位。
      // .select('orderNumber createdAt totalSpent status')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 更新訂單狀態 (管理員)
// router.patch('/all', auth.jwt, admin, updateStatus)
export const updateStatus = async (req, res) => {
  try {
    // 解構 req.body，使用資料庫中的字段名稱
    console.log('Request Body:', req.body)
    const { _id, status } = req.body
    const validStatuses = ['pending', 'in-process', 'completed', 'canceled']
    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的訂單狀態'
      })
    }

    // .findById(_id): 根據 _id 查找訂單
    const order = await Order.findById(_id)
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '訂單不存在'
      })
    }

    // 更新訂單狀態: 後者 status 代表傳入要更新的新的訂單狀態；
    // 前者 order.status 代表原本的訂單狀態。
    order.status = status
    await order.save()

    // 廣播訂單狀態變更給所有連接的客戶端
    req.io.emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status
    })

    // 回傳 '訂單狀態更新成功' 訊息
    res.status(StatusCodes.OK).json({
      success: true,
      message: '訂單狀態更新成功'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '更新訂單狀態失敗'
    })
  }
}

export const updateStatusSpecialty = async (req, res) => {
  try {
    // 解構 req.body，使用資料庫中的字段名稱
    const { _id, status } = req.body
    const validStatuses = ['pending', 'in-process', 'completed', 'canceled']
    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的訂單狀態'
      })
    }

    // .findById(_id): 根據 _id 查找訂單
    const order = await OrderSpecialty.findById(_id)
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '訂單不存在'
      })
    }

    // 更新訂單狀態
    order.status = status
    await order.save()

    // 廣播訂單狀態變更給所有連接的客戶端
    // req.io.emit('orderStatusUpdated', {
    //   orderId: order._id,
    //   status: order.status
    // })

    // 回傳 '訂單狀態更新成功' 訊息
    res.status(StatusCodes.OK).json({
      success: true,
      message: '訂單狀態更新成功'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '更新訂單狀態失敗'
    })
  }
}

export const getStatusList = async (req, res) => {
  try {
    // 取得所有訂單的狀態
    // distinct('status') 方法會返回訂單中 status 欄位的唯一值列表。
    const result = await Order.find().distinct('status')

    // 返回所有訂單狀態列表
    res.status(StatusCodes.OK).json({
      success: true,
      message: '成功取得訂單狀態列表',
      result // 這裡返回所有訂單的狀態列表
    })
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤，無法取得訂單狀態列表'
    })
  }
}

export const getStatusListSpecialty = async (req, res) => {
  try {
    // 取得所有訂單的狀態
    // distinct('status') 方法會返回訂單中 status 欄位的唯一值列表。
    const result = await OrderSpecialty.find().distinct('status')

    // 返回所有訂單狀態列表
    res.status(StatusCodes.OK).json({
      success: true,
      message: '成功取得訂單狀態列表',
      result // 這裡返回所有訂單的狀態列表
    })
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤，無法取得訂單狀態列表'
    })
  }
}

// router.patch('/all', auth.jwt, admin, completeOrder)
export const completeOrder = async (req, res) => {}
export const completeOrderSpecialty = async (req, res) => {}
