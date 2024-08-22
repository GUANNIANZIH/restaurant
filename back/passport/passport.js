// passport 可以去複習 0626 lesson

// 0709/00:23:30
// passport 是一個 Node.js 的 middleware，用來處理使用者的登入驗證。
// 這裡的 passport 要寫帳號密碼登入、JWT 驗證
// 先寫完 passport 再寫 middleware。
import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
// import { StatusCodes } from 'http-status-codes' 這裡好像用不到? 因為是自定義錯誤 message
import User from '../models/user.js'

// 0709/ 00:31:40 使用 passport 去建立自己的驗證方式 ，驗證方式叫做 'login'，
// 並使用了 passwordLocal 的驗證策略
// 0709/00:29:30
passport.use('login', new passportLocal.Strategy({
// 設定驗證策略要去檢查: account、password 兩個欄位，如果密碼一樣不用設定
// 因為預設是檢查 username、password 兩個欄位，
// 但我們使用的是 account、password，所以要修改要檢查的欄位的名稱，
// passportLocal 只會幫忙檢查是否有這兩個欄位。
  usernameField: 'account',
  passwordField: 'password'
//   後面接一個 async 的函式，在驗證通過後會執行，帳號、密碼、完成、trycatch
//   done 是 passport 的 callback，用來回傳驗證結果
}, async (account, password, done) => {
  try {
    // .findOne() 找到第一個符合條件的文件，符合帳號為傳入帳號的東西
    // 當檢查通過以後，去執行 function
    const user = await User.findOne({ account })
    // 如果沒有找到的話，拋出錯誤 message，會對應下面的錯誤訊息
    if (!user) throw new Error('ACCOUNT_NOT_FOUND')
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('PASSWORD_INCORRECT')
    }
    // 如果都沒有問題就把使用者的資料回出去
    // return done(沒有錯誤, 使用者資料, 沒有錯誤)
    return done(null, user, null)
    // 處理錯誤問題
  } catch (error) {
    // 記得在 catch 的地方都 console.log() 幫助 debug
    console.log(error)
    // 如果錯誤的訊息是上面定義的 'ACCOUNT_NOT_FOUND'，就回傳 null
    if (error.message === 'ACCOUNT_NOT_FOUND') {
      // return done(沒有帳號錯誤, 沒有使用者資料, 錯誤訊息)
      // '找不到帳號' 、 '密碼錯誤' 都是 BAD_REQUEST 代表請求無效，因為帳號不存在
      return done(null, null, { message: '找不到帳號' })
    } else if (error.message === 'PASSWORD_INCORRECT') {
      return done(null, null, { message: '密碼錯誤' })
    } else {
    // '未知錯誤' 狀態碼為 500
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
// 0709/ 00:33:03 以上的 passport login 驗證處理好，
// 就去 index.js 把這裡寫好的 passport.js 檔案引入，
// 都引入完成以後，就去寫 middleware (0709/ 00:34:20)
// middleware 可以看 0626 lesson
// middleware 是一個函式，可以在請求到達 "路由之前或之後執行"。--------------------------------

// 0709/ 01:03:20 寫 "取得自己的個人檔案"，先回到 passport.js 去寫 JWT 驗證、middlewares 的設定。
// 0709/ 01:10:40 自己手動檢查過期，因為某些路由可以允許過期的 JWT 才可以發送 "舊換新"。
//  所以才會在 passport.js 設定一個 "jwt"
// 使用 passport 去做 JWT 的驗證，驗證方式叫做 'jwt'，使用了 passportJWT 的驗證策略
passport.use('jwt', new passportJWT.Strategy({
  // 設定 jwt 從哪裡來的，可以放在 header、body、query、cookie，這裡是放在 header 的 Authorization
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 簽甚麼 secret 就要用甚麼 secret 去解密。
  secretOrKey: process.env.JWT_SECRET,
  // 沒有辦法在後面的函式去取得資訊，要打開 passReqToCallback: true ，才可以使用 req 取得資訊。
  // 不然原本預設只有兩個參數，payload、done。
  // 這裡的 payload 是解密後的資料，done 是 passport 的 callback，用來回傳驗證結果。
  passReqToCallback: true,
  // 忽略過期的檢查，要自己去設判斷是否有其，因為要做 "舊換新" 的動作，要讓某些路由允許過期。
  ignoreExpiration: true
}, async (req, payload, done) => {
  try {
    // 自己寫過期的檢查，所以這裡解出 JWT 的過期時間(exp)
    // JWT 在簽的時候除了會有自己指定的東西之外，還會多兩個東西: iat(代表 token 是甚麼時候簽發的)、exp(代表 token 甚麼時候過期)
    // exp 單位原本為秒，轉成 js 時間毫秒的單位，所以要 * 1000，再判斷結果是否小於現在的日期
    const expired = payload.exp * 1000 < new Date().getTime()
    //   0709/ 01:18:00  去判斷請求的網址，
    /*
    舉例:
    http://localhost:4000/user/test?aaa=111&bbb=222
    req.originalUrl: "/user/test?aaa=111&bbb=222"
    req.baseUrl: "/user"
    req.path: "/test"
    req.query: { aaa: '111', bbb: '222' }
    所以這是使用 req.baseUrl、req.path 去串出完整的網址，不需要 req.query，因為 query 是參數。
    */
    const url = req.baseUrl + req.path
    // 如果過期的話，且不是 '/user/extend' 舊換新、'/user/logout 登出，就判斷為過期。
    if (expired && url !== '/user/extend' && url !== '/user/logout') {
    // 拋出錯誤 message，會對應下面的錯誤訊息
      throw new Error('EXPIRED')
    }
    // 自己把 JWT 取出來，只能取得解編後的東西，不能取得原本的 JWT
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 去資料庫找使用者的資料庫中找 _id 符合解出來的 _ID，以及 token 有在 tokens 的陣列裡
    const user = await User.findOne({ _id: payload._id, tokens: token })
    // 如果沒有的話，拋出錯誤 message，會對應下面的錯誤訊息
    if (!user) {
      throw new Error('JWT')
    }
    // 根據不同的錯誤去做處理
    return done(null, { user, token }, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'EXPIRED') {
      return done(null, null, { message: '登入過期' })
    } else if (error.message === 'JWT') {
      return done(null, null, { message: '登入無效' })
    } else {
      // '未知錯誤' 狀態碼為 500
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
// 0709/ 01:22:40 回到 middlewares/auth.js 補上 JWT 的驗證。---------------------
