import { Router } from 'express'
// 用來驗證使用者的身份的 middleware
import * as auth from '../middlewares/auth.js'
// 上傳檔案的 middleware
import upload from '../middlewares/upload.js'
// 確認管理員身分的 middleware
import admin from '../middlewares/admin.js'
// 從 controllers/announcement.js 引入 create、getAll、edit、get、getId
import { create, getAll, edit, get, getId, remove } from '../controllers/news.js'

const router = Router()

// 管理者張貼文章
router.post('/', auth.jwt, admin, upload, create)
// 所有人都可以看到文章
router.get('/', get)
// 管理者取得全部文章
router.get('/all', auth.jwt, admin, getAll)
// 所有人取得單一文章
router.get('/:id', getId)
// 管理者修改文章
router.patch('/:id', auth.jwt, admin, upload, edit)
// 管理者可以刪除進出貨單
router.delete('/:id', auth.jwt, admin, remove)

export default router
