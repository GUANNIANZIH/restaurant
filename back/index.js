import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
// 網路應用程式的跨來源資源共用（CORS）機制
import cors from 'cors'
// 狀態碼
import { StatusCodes } from 'http-status-codes'
// 防止查詢參數中的操作符注入（即防止某些潛在的安全漏洞 $）
import mongoSanitize from 'express-mongo-sanitize'
// 限制別人對伺服器發送請求的次數
// import rateLimit from 'express-rate-limit'
// routes/user.js
import routeUser from './routes/user.js'
// 0709/ 01:12:00 引入 routes/product.js
import routerProduct from './routes/product.js'
import routerSpecialty from './routes/specialty.js'
import routerOrder from './routes/order.js'
import routerRevenue from './routes/revenue.js'
import routerNews from './routes/news.js'
// 0709/ 00:33:10 引入寫好的 passport.js 檔案
// 0709/ 00:34:20 import 好了以後去處理 middleware
import './passport/passport.js'

// 引入 http 和 socket.io
import http from 'http'
import { Server } from 'socket.io'

const app = express()

// Socket.IO 是基於 http 模組運行的，
// 而 Express 也是基於 http 模組構建的 Web 框架。
// 你可以將 Socket.IO 綁定到 Express 創建的 HTTP 伺服器上，
// 這樣它們可以協同工作，處理 HTTP 請求和 WebSocket 連接。

// 創建 http 伺服器並將與 socket.io 綁定
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // 允許來自前端的請求
    methods: ['GET', 'POST'] // 允許的方法
  }
})

io.on('connection', (socket) => {
  console.log('User connected', socket.id)

  socket.on('joinRoom', ({ userId }) => {
    socket.join(userId) // 讓使用者加入自己的房間
    console.log(`User ${userId} joined room`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id)
  })
})

// 將 Socket.IO 的實例附加到 req 對象上
app.use((req, res, next) => {
  req.io = io
  next()
})

// rateLimit() 是一個 middleware 函式，用來限制別人對伺服器發送請求的次數。
// 通常放在第一個 middleware 函式，這樣就可以限制所有的請求，超出了就不需要處理。
// app.use(rateLimit({
//   windowMs: 1000 * 60 * 15, // 15 分鐘
//   max: 100, // 100 次
//   standardHeaders: 'draft-7',
//   legacyHeaders: true, // 適用於舊版的 HTTP 標頭
//   StatusCodes: StatusCodes.TOO_MANY_REQUESTS, // 自己設定狀態碼 429
//   message: '請求次數過多，請稍後再試',
//   handler: (req, res, next, options) => { // 處理函式，如何回應訊息
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message
//     })
//   }
// }))

// "註冊" 功能最後一步，設定 CORS，都完成後可以寫 "登入" 功能 0709/00:21:00 (back 建立 passport 資料夾)
// cors() 是一個 middleware 函式，用來設置跨來源資源共用（CORS）機制。
// app.use('/user',cors({...}) 前面也可以增加指定的路徑，例如 /user 代表只有 user 的路由會套用
// 允許所有來自前端的請求。裡面可以做詳細設定
// cors 可以當作 middlewares 來使用，也可以當作路由中間件來使用
app.use(cors({
  // origin: 'http://localhost:3000' 請求來源
  // callback (錯誤, 是否允許)
  origin: (origin, callback) => {
    // 回傳 origin 請求來源
    console.log(origin)
    // 如果 origin 是 undefined 或是在允許的清單裡面
    // 0709/00:18:30 ，如果是原本的寫法可以只含部分，但如果寫陣列的話要完全符合才行，像是 'http://localhost:3000')
    if (origin === undefined ||
    origin.includes('github.io') || origin.includes('http://localhost:3000') || origin.includes('127.0.0.1')
    ) {
      // 允許, 沒有錯誤
      callback(null, true)
    } else {
      // 不允許, 有錯誤，可以做錯誤處理
      callback(new Error('CORS 問題'), false)
    }
  }
}))
// 0709/00:19:04 原本做 CORS 的錯誤處理，但因為 cors 跨域錯了收不到狀態碼，因為會被擋掉，所以不做錯誤處理。
// .FORBIDDEN 403 代表知道使用者是誰，但不允許他們訪問；401 驗證錯誤
// app.use((_, req, res, next) => {
//   res.status(StatusCodes.FORBIDDEN).json({
//     success: false,
// 不允許跨域
//     message: '請求被拒絕'
//   })
// })

// express.json() 是一個內建的 middleware 函式，用來解析請求物件中的 JSON 格式資料。
app.use(express.json())

// 如果 express 出錯的話要做的事情
// 用來處理全局錯誤的 middleware 函式
// 但目前 res.status(StatusCodes.BAD_REQUEST) 的錯誤回應邏輯，
// 這樣會導致所有的請求在到達其他中間件、路由之前都會直接返回 "400 Bad Request 狀態碼資料格式錯誤" 的錯誤回應，
// 而沒有檢查是否確實存在錯誤，因此不會繼續到後續的路由或中間件進行處理。

// 如果需要一個專門處理錯誤的中間件，這個中間件只有在出現錯誤時被調用，而非無條件處理每一個請求，
// Express 中通常使用一個錯誤處理中間件來抓取和處理所有未被抓取的錯誤。
// 應該要保持錯誤處理中間件的正確位置，應該放在所有其他路由和中間件的之後，作為一個最後抓取錯誤的機制。
// 所以把全局錯誤處理中間件放到後面。
// app.use((_, req, res, next) => {
//   res.status(StatusCodes.BAD_REQUEST).json({
//     success: false,
//     message: '資料格式錯誤'
//   })
// })

// 一定要放在 express.json() 之後，才會有 sanitize 消毒效果，$gt、$lt 這些操作符會被過濾掉
// 因為在 express.json() 之後才會有 req.body
app.use(mongoSanitize())

// 在 index.js 引用 routes/user.js
app.use('/user', routeUser)
// 0709/ 01:13:00 引用 routes/product.js
app.use('/product', routerProduct)
app.use('/specialty', routerSpecialty)
app.use('/order', routerOrder)
app.use('/revenue', routerRevenue)
app.use('/news', routerNews)

// 當找不到請求路徑時，回傳 404 錯誤
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到內容'
  })
})

// Express 啟動連線到 MongoDB 資料庫
// 使用 Mongoose 提供的功能來設置和管理資料庫連接。
// 使用 async/await 確保異步操作的順序執行。
// app.listen(process.env.PORT || 4000, async () => {
//   console.log('伺服器啟動')
//   連線到 MongoDB 資料庫
//   console.log('伺服器連線')
//   await mongoose.connect(process.env.DB_URL)
//   設置 Mongoose 選項，啟用 sanitizeFilter:
//    防止查詢參數中的操作符注入（即防止某些潛在的安全漏洞 $）。
//   mongoose.set('sanitizeFilter', true)
//   console.log('資料庫連線成功')
// })

// 全局錯誤處理中間件
app.use((err, req, res, next) => {
  // 打印錯誤堆到控制台
  console.error(err.stack)

  // 檢查是否已經發送響應給用戶端
  if (res.headersSent) {
    // 如果響應已經發送，直接傳遞錯誤
    return next(err)
  }

  // 返回 500 狀態碼和錯誤消息
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || '伺服器錯誤'
  })
})

server.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  // 連線到 MongoDB 資料庫
  console.log('伺服器連線')
  await mongoose.connect(process.env.DB_URL)
  // 設置 Mongoose 選項，啟用 sanitizeFilter:
  // 防止查詢參數中的操作符注入（即防止某些潛在的安全漏洞 $）。
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
