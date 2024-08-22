// 引入 models
import User from '../models/user.js'
import Product from '../models/product.js'
import Specialty from '../models/specialty.js'
import Order from '../models/order.js'
// 狀態碼
import { StatusCodes } from 'http-status-codes'
// jsonwebtoken 是用來 "簽發和驗證" JSON Web Tokens (JWT) 的套件
import jwt from 'jsonwebtoken'
import validator from 'validator'

// create 創建會員
// express 會根據參數處理請求，兩個參數(req, res)是一般處理請求的 function；
// 三個 middleware、四個處理錯誤。
export const create = async (req, res) => {
  try {
    // 解析請求物件中的 JSON 格式資料，這裡要避免 MongoDB 潛在的安全漏洞 $get, $pull...
    // 回到 index.js 設置 Mongoose 選項，啟用 sanitizeFilter 防止查詢參數中的操作符注入。
    await User.create(req.body)
    // 這裡不會把 "create" 的資料回傳回去
    res.status(StatusCodes.OK).json({
      success: true,
      message: '會員註冊成功' // 這裡只會說註冊成功， 密碼是加密狀態，不會回傳資料
    })
    // 如果有錯誤的話
  } catch (error) {
    // 'ValidationError' 是 mongoose 的錯誤
    if (error.name === 'ValidationError') {
      // 取出錯誤的第一個東西取出
      const key = Object.keys(error.errors)[0]
      // 再去取出錯誤的訊息
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
      // 如果重複的話
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '會員已存在'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 0709/ 00:50:15、0709/ 00:56:40 重複一次講解
// login 會員登入
// 需要 async 是因為要等待 jwt 簽出來之後，要放到資料庫
export const login = async (req, res) => {
  try {
    // 簽一個 jwt，把使用者的 _id 放到 jwt 裡面 (不一定是放使用者的 _id)
    // 記得在 jwt 不要放敏感資料，例如: 密碼、信用卡資料，因為都是明碼 base64
    // 但有些 jwt 會放使用者的 _id，這樣就可以用 _id 去找使用者的資料，但還會再去驗證登入是否為一樣的 token
    // 用 secret 去做 jwt 驗證，記得補 .env 的 SECRET，並設定 jwt 七天後過期。

    // 0716/ 00:10:15 先暫時把過期時間設定為 { expiresIn: '10s' }，用來確認是否會自己舊換新
    // login, extend 都要設定
    // 因為 auth.js 的 req.user = user
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 簽完以後把 (token) 放在使用者的 tokens 陣列裡面
    req.user.tokens.push(token)
    // 這裡要加上 await，因為要等待資料庫存檔動作
    await req.user.save()
    // 回應前端所需要的資訊
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 0709/ 00:59:00
      // "記得把前端所需要顯示的資訊回傳回去"，前端要顯示甚麼就回傳甚麼
      result: {
        // token 一定要回傳回去，因為前端要記起來，每次請求都要帶 token
        token,
        // 前端才可以根據帳號去產生大頭照的圖片
        account: req.user.account,
        phoneNumber: req.user.phoneNumber,
        // 角色是否為管理員
        role: req.user.role,
        // 購物車的數量，cartQuantity 是在 model/user.js 裡面的 virtual 虛擬欄位，
        // 並非真的欄位，而是根據 cart 產生的虛擬欄位。
        cart: req.user.cartQuantity,
        cartSpecialties: req.user.cartSpecialtyQuantity,
        // 會員累積消費
        totalSpent: req.user.totalSpent,
        // 會員累積點數
        totalPoint: req.user.totalPoint
      }
    })
  } catch (error) {
    console.log(error)
    // 錯誤接 "未知錯誤"
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
  // 0709/ 00:53:50 完成 user 登入的 controllers/user.js  login
}

// 0709/ 01:01:55
// 前端只會保存簽出去的 JWT，所以每一次重新整理進入網頁的每一次請求，
// 前端都要用 JWT 去要使用者的資料。
// 每次登入的時候，都只會保存 jwt 在 Pinia 裡面，
// 所以要寫一個 API 讓每一次進網頁時，去檢查使用者的資訊。

// JWT 上面設定了七天失效 { expiresIn: '7d' }
// 但可能使用者在第六天登入快過期時，這時候要寫一個舊換新的 API，重新簽發一個新的 JWT，並且把舊的 JWT 刪除。
// 舊換新的 API: 使用者就可以拿舊的 token 去換新的 token，這樣就可以一直使用。
// 但這個做法很多，這裡簡化的做法是: 如果前端發送請求，得到 "過期" 的結果的話，會自動發出 "舊換新" 的動作。

// 0709/ 01:03:20 寫 "取得自己的個人檔案 /profile"，先回到 passport.js 去寫 JWT 驗證。------------------

// 0709/ 01:32:40 依序完成 "舊換新 extend"、"抓自己的資料 profile"、"登出 logout" 的 controllers/user.js
// /extend 做 "舊換新"，/extend 會經過 jwt 的 middleware 驗證，所以可以取得現在登入的使用者跟登入的 token，
// /extend 要將 tokens 陣列裡面的東西換掉
export const extend = async (req, res) => {
  try {
    // 先去找在陣列裡面的第幾個索引( idx )
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 再簽一個新的 token 給他
    // 0716/ 00:10:15 先暫時把過期時間設定為 { expiresIn: '10s' }，用來確認是否會自己舊換新
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 找到索引後，直接換成 "新的 token"
    req.user.tokens[idx] = token
    await req.user.save()
    // 回應成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: '', // 為甚麼訊息是空的?
      result: token // 回應新的 token
    })
  } catch (error) {
    console.log(error)
    // 如果有錯誤，應該只會有 "未知錯誤"
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 0709/ 01:37:00 "取得自己的資料 profile" 把前端會需要用到的東西回傳回去
// 不需要 async 不需要等待資料庫的動作，因為使用者的資料都在 req.user 裡面，也沒有要存資料給資料庫
// profile 的用途是當使用者登入時，只會把 token 存在 localStorage 裡面，這樣重新整理時，就需要拿 token 去取得使用者的資料。
// 所以這裡要回傳 "使用者的資料 - 前端會用到的東西"，讓前端可以顯示。
export const profile = (req, res) => {
  try {
    // 直接回應狀態碼
    res.status(StatusCodes.OK).json({
      success: true,
      message: '', // 錯誤訊息為空
      result: { // 上面 login 時回應了 token、account、role、cart: req.user.cartQuantity 購物車數量
        // 所以取自己的資料時，也要回傳這些資料，但這裡不需要回應 token，因為 token 已經在前端了
        account: req.user.account,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        cart: req.user.cartQuantity,
        cartSpecialties: req.user.cartSpecialtyQuantity,
        totalSpent: req.user.totalSpent,
        totalPoint: req.user.totalPoint
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 0709/ 01:40:24 "登出 logout"
// /logout 把現在使用者登入的 token，從使用者的 tokens 陣列裡面刪除，
// 使用者的 tokens 陣列裡面有好幾個使用者登入的 jwt(token)，現在要取使用者登入的 token 並刪除。
// 可以使用 .filter() 把不對的留下，隊的清除，
// 或是.findIndex() 再去 .splice()
// JS 有很多方法可以用，像是 .pop()、.shift()、.slice()、.concat()、.map()、.reduce()、.forEach()...
export const logout = async (req, res) => {
  try {
    // 使用 .filter() 把不符合現在的 token 給 .save
    // 改寫下面方式的原因是因為 .filter() 會回傳一個新的陣列，不會改變原本的陣列
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    // 保存後回應成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
      // logout 不需要 result 回傳資料
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 0717 01:57:50
// 編輯、加入購物車，要傳入兩個東西 (商品 id、商品數量 (前端傳遞的是相對值 +1, -1))，到後端做修改
export const editCart = async (req, res) => {
  try {
    // 先檢查商品 id，使用 validator 套件的 isMongoId() 方法，把原本用在 product 的(req.params.id) 改成 (req.body.product)
    // req.params.id 用來存取 URL 路徑的動態參數值，參數通常來自於路由定義中的佔位符。例如: URL: /users/123，所以 req.params.id 的值: '123'。
    // req.body.product 用來存取 POST 請求的參數值， 用來存取請求體中的資料，這些資料通常是透過 POST、PUT 等請求方法傳遞的，
    // req.body 是 Express 用來存放解析過的請求體的物件，你可以使用 req.body.product 來存取請求體中的 product 屬性。

    // 先檢查商品 id，如果有錯誤就拋出錯誤 throw new Error('ID')，對的話繼續下一步。
    if (!validator.isMongoId(req.body.product)) throw new Error('ID')
    // 尋找購物車內是否有這個商品 id，有 id 的話就 "改數量"，找不到就 "新增"。
    // 這裡的 req 已經經過 auth.jwt 驗證，所以這裡的 req 裡面有 user 的資訊。
    // 0717 02:00:40
    // 使用 .findIndex() 檢查每一個東西 p_id.toString()，因為格式是 MongoDB 的格式要轉成一般文字，才可以跟一般傳入的東西做比較，
    // 將每個 p_id.toString() 檢查是否為傳入的 req.body.product。
    // 可以對照 model 的 user.js 裡面的 cartSchema 格式來看，
    // user 的 cart 裡面是一個陣列 cart:[cartSchema]，在對照 cartSchema 的格式，美個東西都會有 p_id、quantity 兩個欄位。
    const idx = req.user.cart.findIndex(item => item.p_id.toString() === req.body.product)
    // 找完以後如果 > -1，因為索引從 0 開始，就代表購物車內部有東西。
    if (idx > -1) {
      // 0717 02:02:00
      // 有東西的話就修改數量 quantity，這裡不寫 NAN 驗證。
      // 這裡先執行把 req.user.cart[idx].quantity 舊有的數量，跟新的傳入要求 parseInt(req.body.quantity) 相加。

      // req.user 代表當前已經驗證的使用者資料。
      // cart 是該使用者的購物車，這是一個陣列。
      // idx 是該陣列中的某個索引，用來指定購物車中的特定商品。
      // quantity 則是這個商品目前在購物車中的數量。

      // req.body 代表來自客戶端請求的資料，通常包含在 POST 或 PUT 請求的主體（body）中。
      // quantity 是客戶端提交的購物車中該商品的新數量，但它是以字串形式傳送的。
      // parseInt() 函數會將這個字串轉換為整數。
      // 計算出的數值將被存儲在 quantity 這個變數中。
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      // 根據 quantity 值是正數還是非正數，來決定是否刪除該商品或更新其數量。
      // 如果 quantity（商品數量）小於或等於 0，那麼這個商品應該從購物車中刪除。
      if (quantity <= 0) {
        // 刪除，從索引開始刪除一個
        // splice(idx, 1) 是一個用來移除陣列中元素的方法。
        // idx 是要刪除的商品的索引，1 表示刪除一個元素。
        req.user.cart.splice(idx, 1)
      } else {
        // 如果有存在的話，把新的變數 quantity 放進去，req.user.cart[idx].quantity
        req.user.cart[idx].quantity = quantity
        // +++++++ 更新 customizations +++++++
        req.user.cart[idx].customizations = req.body.customizations || {}
      }
      // 0717 02:04:15
      // 如果購物車內不存在這個商品的話
    } else {
      // 購物車內沒這個商品，檢查商品是否存在
      // 引用 product 的 model，使用 findById() 方法查找商品。
      // .orFail(new Error('NOT FOUND')) 如果沒有找到的話，拋出錯誤(NOT FOUND)。

      // 0717 02:05:35
      // 有無下架的判斷很多種: findById(req.body.product)、findOne({_id: req.body.product, sell: true})，找出 id 要符合傳入的 id、且有上架的商品。
      // 可以根據有無上下架，來寫回應，例如: 商品如果下架了，就不給使用者加入購物車
      // findOne({_id: req.body.product, sell: true})，都要符合才會回傳。
      // 沒有的話就會直接寫找不到: 商品下架、商品沒了都會回應找不到。
      // 但是如果想要把下架分開寫的話，就要改寫 findById(req.body.product)，再另外寫判斷 sell: true。
      const product = await Product.findById(req.body.product).orFail(new Error('NOT FOUND'))
      // 如果商品已下架，拋出錯誤 throw new Error('SELL')
      if (!product.sell) throw new Error('SELL')
      // 回應.push()，把新的商品加進去 p_id、quantity、customizations
      req.user.cart.push({
        p_id: product._id,
        quantity: req.body.quantity,
        customizations: req.body.customizations || {}
      })
    }

    // 0717 02:07:15
    // 保存購物車內容，這裡要用 await，因為要等待資料庫存檔動作。
    await req.user.save()
    // 回傳成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 回傳使用者購物車新的數量
      // 購物車的數量，cartQuantity 是在 model/user.js 裡面的 virtual 虛擬欄位，
      result: req.user.cartQuantity
    })
    // 0717 02:08:00
    // 錯誤處理的部分，可以參考編輯商品的部分 controllers/product.js/edit 的錯誤處理。
    // 對照上面拋出的錯誤: 'ID'、'NOT FOUND'、'SELL'，來寫錯誤處理。
    // '商品 ID 格式錯誤'、'查無商品'、'商品已下架'。
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '商品 ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品'
      })
    } else if (error.message === 'SELL') {
      // 因為下架可能是 404 也有可能是 400，這裡是 400
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '商品已下架'
      })
      // 'ValidationError' 是 mongoose 的錯誤
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
  // 0717 02:13:30 錯誤處理的部分用完可以接著 stores
}

export const editCartSpecialty = async (req, res) => {
  try {
    // 先檢查商品 id，使用 validator 套件的 isMongoId() 方法，把原本用在 product 的(req.params.id) 改成 (req.body.product)
    // req.params.id 用來存取 URL 路徑的動態參數值，參數通常來自於路由定義中的佔位符。例如: URL: /users/123，所以 req.params.id 的值: '123'。
    // req.body.product 用來存取 POST 請求的參數值， 用來存取請求體中的資料，這些資料通常是透過 POST、PUT 等請求方法傳遞的，
    // req.body 是 Express 用來存放解析過的請求體的物件，你可以使用 req.body.product 來存取請求體中的 product 屬性。

    // 先檢查商品 id，如果有錯誤就拋出錯誤 throw new Error('ID')，對的話繼續下一步。
    if (!validator.isMongoId(req.body.product)) throw new Error('ID')
    // 尋找購物車內是否有這個商品 id，有 id 的話就 "改數量"，找不到就 "新增"。
    // 這裡的 req 已經經過 auth.jwt 驗證，所以這裡的 req 裡面有 user 的資訊。
    // 0717 02:00:40
    // 使用 .findIndex() 檢查每一個東西 p_id.toString()，因為格式是 MongoDB 的格式要轉成一般文字，才可以跟一般傳入的東西做比較，
    // 將每個 p_id.toString() 檢查是否為傳入的 req.body.product。
    // 可以對照 model 的 user.js 裡面的 cartSchema 格式來看，
    // user 的 cart 裡面是一個陣列 cart:[cartSchema]，在對照 cartSchema 的格式，美個東西都會有 p_id、quantity 兩個欄位。
    const idx = req.user.cartSpecialties.findIndex(item => item.p_id.toString() === req.body.product)
    // 找完以後如果 > -1，因為索引從 0 開始，就代表購物車內部有東西。
    if (idx > -1) {
      // 0717 02:02:00
      // 有東西的話就修改數量 quantity，這裡不寫 NAN 驗證。
      // 這裡先執行把 req.user.cart[idx].quantity 舊有的數量，跟新的傳入要求 parseInt(req.body.quantity) 相加。

      // req.user 代表當前已經驗證的使用者資料。
      // cart 是該使用者的購物車，這是一個陣列。
      // idx 是該陣列中的某個索引，用來指定購物車中的特定商品。
      // quantity 則是這個商品目前在購物車中的數量。

      // req.body 代表來自客戶端請求的資料，通常包含在 POST 或 PUT 請求的主體（body）中。
      // quantity 是客戶端提交的購物車中該商品的新數量，但它是以字串形式傳送的。
      // parseInt() 函數會將這個字串轉換為整數。
      // 計算出的數值將被存儲在 quantity 這個變數中。
      const quantity = req.user.cartSpecialties[idx].quantity + parseInt(req.body.quantity)
      // 根據 quantity 值是正數還是非正數，來決定是否刪除該商品或更新其數量。
      // 如果 quantity（商品數量）小於或等於 0，那麼這個商品應該從購物車中刪除。
      if (quantity <= 0) {
        // 刪除，從索引開始刪除一個
        // splice(idx, 1) 是一個用來移除陣列中元素的方法。
        // idx 是要刪除的商品的索引，1 表示刪除一個元素。
        req.user.cartSpecialties.splice(idx, 1)
      } else {
        // 如果有存在的話，把新的變數 quantity 放進去，req.user.cart[idx].quantity
        req.user.cartSpecialties[idx].quantity = quantity
      }
      // 0717 02:04:15
      // 如果購物車內不存在這個商品的話
    } else {
      // 購物車內沒這個商品，檢查商品是否存在
      // 引用 product 的 model，使用 findById() 方法查找商品。
      // .orFail(new Error('NOT FOUND')) 如果沒有找到的話，拋出錯誤(NOT FOUND)。

      // 0717 02:05:35
      // 有無下架的判斷很多種: findById(req.body.product)、findOne({_id: req.body.product, sell: true})，找出 id 要符合傳入的 id、且有上架的商品。
      // 可以根據有無上下架，來寫回應，例如: 商品如果下架了，就不給使用者加入購物車
      // findOne({_id: req.body.product, sell: true})，都要符合才會回傳。
      // 沒有的話就會直接寫找不到: 商品下架、商品沒了都會回應找不到。
      // 但是如果想要把下架分開寫的話，就要改寫 findById(req.body.product)，再另外寫判斷 sell: true。
      const product = await Specialty.findById(req.body.product).orFail(new Error('NOT FOUND'))
      // 如果商品已下架，拋出錯誤 throw new Error('SELL')
      if (!product.sell) throw new Error('SELL')
      // 回應.push()，把新的商品加進去 p_id、quantity
      req.user.cartSpecialties.push({
        p_id: product._id,
        quantity: req.body.quantity
      })
    }

    // 0717 02:07:15
    // 保存購物車內容，這裡要用 await，因為要等待資料庫存檔動作。
    await req.user.save()
    // 回傳成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 回傳使用者購物車新的數量
      // 購物車的數量，cartQuantity 是在 model/user.js 裡面的 virtual 虛擬欄位，
      result: req.user.cartSpecialtyQuantity
    })
    // 0717 02:08:00
    // 錯誤處理的部分，可以參考編輯商品的部分 controllers/product.js/edit 的錯誤處理。
    // 對照上面拋出的錯誤: 'ID'、'NOT FOUND'、'SELL'，來寫錯誤處理。
    // '商品 ID 格式錯誤'、'查無商品'、'商品已下架'。
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '商品 ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品'
      })
    } else if (error.message === 'SELL') {
      // 因為下架可能是 404 也有可能是 400，這裡是 400
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '商品已下架'
      })
      // 'ValidationError' 是 mongoose 的錯誤
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
  // 0717 02:13:30 錯誤處理的部分用完可以接著 stores
}

// 0717 02:34:50
// 取得使用者購物車的內容，一次回給前端，不使用 server 的 data-table
// 寫購物車的頁面，加入購物車成功，再來把購物車資料抓出來，補 controllers/user.js/getCart 取購物車
export const getCart = async (req, res) => {
  try {
    // 這裡不能直接 req.user 因為要同時帶出購物車的商品資訊，所以要再另外執行一次查詢動作，要使用 populate()
    // .findById(req.user._id) 找使用者，取 _id，後面只顯示 cart 欄位。findById 的第二個參數是用來顯示要哪些欄位。
    // 使用關聯的方式把商品的資訊帶進來 populate()，要對照的 models/user.js。
    // populate() 後面是接要把哪個欄位的資料給關聯出來，要關聯的欄位是 cart 裡面的 p_id，裡面使用 ref:'products'，代表 p_id 跟 products 有關連。
    // 所以寫 .populate('cart.p_id')

    // 0717 02:38:35
    // populate 可以把 ref 關聯的資料帶出來，可以去看購物車 api 的時候有講過 populate 的功能。
    // 這裡做完寫購物車的頁面， cart.vue 做購物車的頁面。

    // 确保 getCart 方法在返回购物车数据时也包含 customizations 数据。
    const result = await User.findById(req.user._id, 'cart').populate('cart.p_id')
    // 將資料帶出來以後回應狀態碼
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 回應購物車 result.cart
      // 不要值些回 result，因為 result 裡面有很多資料，只要回傳需要的就好。
      result: result.cart
    })
  } catch (error) {
    // 處理錯誤訊息: 未知錯誤
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getCartSpecialty = async (req, res) => {
  try {
    // 這裡不能直接 req.user 因為要同時帶出購物車的商品資訊，所以要再另外執行一次查詢動作，要使用 populate()
    // .findById(req.user._id) 找使用者，取 _id，後面只顯示 cart 欄位。findById 的第二個參數是用來顯示要哪些欄位。
    // 使用關聯的方式把商品的資訊帶進來 populate()，要對照的 models/user.js。
    // populate() 後面是接要把哪個欄位的資料給關聯出來，要關聯的欄位是 cart 裡面的 p_id，裡面使用 ref:'products'，代表 p_id 跟 products 有關連。
    // 所以寫 .populate('cart.p_id')

    // 0717 02:38:35
    // populate 可以把 ref 關聯的資料帶出來，可以去看購物車 api 的時候有講過 populate 的功能。
    // 這裡做完寫購物車的頁面， cart.vue 做購物車的頁面。

    // 确保 getCart 方法在返回购物车数据时也包含 customizations 数据。
    const result = await User.findById(req.user._id, 'cartSpecialties').populate('cartSpecialties.p_id')
    // 將資料帶出來以後回應狀態碼
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 回應購物車 result.cart
      // 不要值些回 result，因為 result 裡面有很多資料，只要回傳需要的就好。
      result: result.cartSpecialties
    })
  } catch (error) {
    // 處理錯誤訊息: 未知錯誤
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 0709/ 01:43:50 以上完成了後端所有驗證相關的功能。
// create、login、extend、profile、logout 都完成了，接下來就是寫 "前端登入驗證" 的東西。
// 做前後端整合時，需要注意現在發生的錯誤是 "前端" 還是 "後端" 所發生的? 要做區分!!!!! important!
// 0709/ 01:45:00 開始回去前端修改 "註冊頁" 的標題。

// 計算會員累積消費金額 :
// 尋找會員: 根據 req.user._id 或 req.params.id 查找會員。

// 處理重複累加的問題 :
// 應該在更新使用者的 totalSpent 欄位之前，先重新計算所有訂單的總金額並直接將這個新計算結果賦值給 user.totalSpent，
// 而不是將新的總金額與現有的 totalSpent 相加。
export const calculateTotalSpent = async (req, res) => {
  try {
    // 先找到指定的會員
    const user = await User.findById(req.user._id)
    // 如果沒有會員就拋出錯誤
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無會員'
      })
    }
    // 查找該會員的所有訂單
    const orders = await Order.find({ user: req.user._id })
    // 計算該會員的總消費金額
    // 使用 reduce 方法遍歷所有訂單並累加每個訂單的 totalAmount。
    const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0)

    // 更新會員的總消費金額
    // user.totalSpent 代表 models/user.js 裡面的 totalSpent
    // 後面的 totalSpent 代表這裡定義的 totalSpent
    // 更新 totalSpent 欄位: 將計算出的總金額儲存在會員的 totalSpent 欄位中。

    // 更新會員的總消費金額為計算出的總金額
    user.totalSpent = totalSpent

    // 計算並更新會員的點數
    const pointsEarned = Math.floor(user.totalSpent / 50)
    user.totalPoint = pointsEarned

    // 儲存更新後的會員資料到資料庫中。
    await user.save()

    // 回應成功
    res.status(StatusCodes.OK).json({
      success: true,
      message: '會員消費累計及點數成功更新',
      result: {
        account: user.account,
        totalSpent: user.totalSpent,
        totalPoint: user.totalPoint
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// convertSpentToPoints 這個 function 是用來把消費金額轉換成點數
// 在消費達到一定金額後立即更新點數，這個 controller 可能會在特定的情境下被呼叫，例如當會員消費或進行某些操作時。
// 可以在適當的地方觸發這個 controller，比如在會員消費更新 totalSpent 後自動執行點數更新。
// export const convertSpentToPoint = async (req, res) => {
//   try {
//     // 先找到指定的會員
//     const user = await User.findById(req.user._id)
//     // 如果沒有會員就拋出錯誤
//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: '查無會員'
//       })
//     }
//     // pointsEarned
//     // 計算累積消費金額轉換為點數
//     // Math.floor 用來確保點數取整數，並去掉小數部分
//     const pointsEarned = Math.floor(user.totalSpent / 50)
//     // 更新會員的點數
//     user.totalPoint += pointsEarned
//     // 儲存更新後的會員資料
//     await user.save()
//     // 回應成功
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '會員點數新增成功',
//       result: {
//         account: user.account,
//         totalSpent: user.totalSpent,
//         totalPoint: user.totalPoint
//       }
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: '未知錯誤'
//     })
//   }
// }
