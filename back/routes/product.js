// product routes
// 0716/ 01:03:00、01:04:30
// 先去完成只有管理者才可以進入的 middlewares/admin.js
import { Router } from 'express'
// upload 用來驗證 token
import * as auth from '../middlewares/auth.js'
// upload 上傳檔案的 middleware(指定上傳的位置、格式、大小)。
import upload from '../middlewares/upload.js'
// admin 用來驗證是否為管理者。
import admin from '../middlewares/admin.js'
// create 用來新增商品的方法。
import { create, getAll, get, getId, edit } from '../controllers/product.js'

const router = Router()

// 0716/ 01:05:00
// 代表要先經過 auth.jwt、看是否為管理員、才可以上傳檔案、才可以新增商品。
router.post('/', auth.jwt, admin, upload, create)
// 0716/ 04:10:40
// "取得所有商品" 分成兩種:
// 一個是前端可以看到所有上架的商品不分使用者 router.get('/', get)
// 另一個是管理者才可以看到的所有上下架的商品 router.get('/all', auth.jwt, admin, getAll)

// 0717 00:18:00
// 不需要經過 auth.jwt，就可以取得商品，但看不到下架的。
router.get('/', get)
// 需要經過 auth.jwt、看是否為管理員，才可以取得不分上下架的所有商品。
// 0717/ 00:19:30
// 注意 all 一定要放在 :id 前面，不然會被 :id 蓋掉，id一定要在後面。

// 0716/ 04:11:30
// 開一個路由名稱叫做 /all，必須登入 auth.jwt，必須是管理員 admin，再執行 controllers/product.js/getAll
router.get('/all', auth.jwt, admin, getAll)

// 0717 00:18:00
// /:id 不需要經過 auth.jwt，就可以查詢取得單一商品
router.get('/:id', getId)

// 0716/ 05:02:05 商品編輯路由，更新 "指定商品的 id"
// 只有管理員才可以編輯商品，使用 patch 方法，去寫方法。
// 所以要經過 auth.jwt 驗證、看是否為管理員，可能會換圖片所以會經過 upload、再到 controllers/product.js/edit 編輯方法。
router.patch('/:id', auth.jwt, admin, upload, edit)
// 代表這個檔案是一個 router，所以要 export 出去。
export default router
