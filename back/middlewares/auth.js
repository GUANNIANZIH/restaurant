// middlewares 可以複習 0626 lesson

// 0709/ 00:34:35
// 當使用者註冊完成，要做登入時，路由先到 index.js，再到 middlewares/auth.js 去處理，過程中會用到 passport.js
// 這裡的 middleware 叫做 auth.js 因為是用來驗證使用者的身份。

// 引入 passport
import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
// 這裡如果寫 jwt 當變數名稱，可能會跟 jwt 函式名稱衝突，所以改成 jwtModule
// 其實這裡可以不用引入，因為在使用 passport.js 套件本身就會使用到 jwt 所以就已經引入過了，但保險起見都還是 npm i
// jsonwebtoken 是用來 "簽發和驗證" JSON Web Tokens (JWT) 的套件
import jsonWebToken from 'jsonwebtoken'

// 記得要寫 export，這樣其他檔案才能引入這個 function
export const login = (req, res, next) => {
// passport 去使用 authenticate 方法，使用自定義的 'login' 方式
// authenticate 是 passport 的方法，用來驗證使用者的身份
// 記得要設定 { session: false }，不然會被 cookie 一直重新導向
//  (error, user, info) 這三個參數是 authenticate 的 callback，如果有錯誤，就會在 error 裡面，使用者資料在 user 裡面，info 是其他資訊
//  (error, user, info) 會回應在 passport.js 的 done() 裡面
// 0709/ 00:38:25 做第三方登入
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // 如果沒有 user 或是有錯誤的話
    if (!user || error) {
      // 如果 info.message === 'Missing credentials' 代表該填寫的欄位沒有填寫，這個是 passport.js 驗證策略的錯誤訊息
      if (info.message === 'Missing credentials') {
        // 對應 passport.js 的錯誤訊息，'找不到帳號' 、 '密碼錯誤' 都是 BAD_REQUEST 代表請求無效，因為帳號不存在
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '輸入欄位錯誤'
        })
        return
        // 0709/ 00:40:15
        // 這裡的錯誤訊息要去對應 passport.js 的錯誤訊息
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: info.message
        })
        return
      }
    }
    req.user = user
    next()
  })(req, res, next)
//   0709/00:48:45
  // 這裡的 middlewares/auth.js login 完成後，
  // 回到 routes/user.js 執行 create，再回到 controllers/user.js 執行 create，
  // 最後回到 routes/user.js 執行 create 的回應。
}

// 0709/ 00:45:45 ~ 00:47:00 再講解一次 middleware
// 在執行登入時，路由會寫先進到這裡的 login 的 middleware，
// passport.authenticate('login',...) 代表去使用 login 的驗證方式，
// 讀取到上面這段 code，會跳到 passport.js 的 login 驗證方式，去檢查確認 user 是否有指定的欄位 (帳號、密碼)。
// 如果 "沒有" 的話，會跳回到 middleware/auth.js 這裡，
// 並回應第一個 BAD_REQUEST 錯誤訊息(message: '帳號或密碼未填寫')，這裡是 passport.js 驗證策略的錯誤訊息。

// 所以當使用者進行 "登入" 時，會先到 middlewares/auth.js 跳到 passport.js 的 'login'，如果發生錯誤就會跳回來 middlewares/auth.js，並執行後面的錯誤的訊息。
// 在 passport.js 不管成功、失敗，都會回到 middlewares/auth.js 執行後面的程式碼。

// 0709/ 00:46:25
// 如果在執行 passport.js 的 'login'，發現沒有指定的欄位，就會跳回 middlewares/auth.js 執行第一個錯誤 'Missing credentials'。
// 如果確認 passport.js 的 'login' 確認有指定欄位，就會執行 passport.js 的 'login' 後面的程式碼，都 OK 通過就會執行到 return done(null, user, null)，再回到 middlewares/auth.js 執行 req.user = user，最後執行 next()。

// 在 passport.js 的 'login' 所設定的三個參數(error, user, info)，會對應 passport.authenticate('login',...) 的三個參數(error, user, info)。
// ---------------------------------------------------------------

// 0709/ 01:23:00 補 JWT 驗證的 middleware
export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 先檢查是否為 JWT 錯誤
      if (info instanceof jsonWebToken.JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '登入無效'
        })
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
// ---------------------------------------

// 0709/ 01:29:30 接下來寫 "三個路由"，再來就是寫 "前端登入驗證" 的東西。
