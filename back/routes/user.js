import { Router } from 'express'
import { create, login, extend, profile, logout, editCart, editCartSpecialty, getCart, getCartSpecialty, calculateTotalSpent } from '../controllers/user.js'
// middleware/auth.js 裡面有兩個 function，一個是 login，一個是 jwt
import * as auth from '../middlewares/auth.js'

// 使用 express.Router() 來建立路由模組
const router = Router()

// 創建會員資料
// 進行 controllers/user.js 的 create
router.post('/', create)
// 會員登入
// 先進行 middlewares/auth.js 的 login 驗證，
// 再進行 controllers/user.js 的 login
router.post('/login', auth.login, login)
// 0709/ 01:29:30
// extend 處理 "token 舊換新"
// "三個路由"，再來就是寫 "前端登入驗證" 的東西。
// 這裡需要三個路由處理: "舊換新 /extend"、"取自己的資料 /profile"、"登出 /logout"
router.patch('/extend', auth.jwt, extend)
// 管理者可以取得使用者的所有資料
router.get('/profile', auth.jwt, profile)
// 驗證身分後可以登出
router.delete('/logout', auth.jwt, logout)
// 0717 01:56:30
// 購物車會有兩個要處理，
// 第一個為 patch，名為 '/cart' 的路由，需要經過 "購物車要登入所以需要 auth.jwt 去驗證"，
// 再 "使用 editCart 方法編輯購物車"
// 這個 editCart 主要是 "使用者編輯自己的購物車"
router.patch('/cart', auth.jwt, editCart)
router.patch('/cartSpecialty', auth.jwt, editCartSpecialty)
// 0717 01:57:05
// 第二個為 get，名為 '/cart' 的路由，需要經過 "購物車要登入所以需要 auth.jwt 去驗證"，
// 再 "使用 getCart 方法取得購物車"
router.get('/cart', auth.jwt, getCart)
router.get('/cartSpecialty', auth.jwt, getCartSpecialty)
// calculateTotalSpent
router.post('/calculate-totalSpent', auth.jwt, calculateTotalSpent)
// router.post('/convert-to-points', auth.jwt, convertSpentToPoint)

// 0717 01:57:15
// 寫完上面兩個 editCart、getCart 就可以去寫 controllers/user.js 的 editCart、getCart 了。
// 要記得上面要 import editCart、getCart 這兩個 function。

export default router
