import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
import { create, getAll, getId, edit, remove } from '../controllers/revenue.js'

const router = Router()

// 管理者建立進出貨單
router.post('/', auth.jwt, admin, create)
// 管理者取得全部進出貨單，前端顯示 data-table 格式，點擊 table-list 顯示單一 card
router.get('/all', auth.jwt, admin, getAll)
// 管理者取得單一進出貨單，用在編輯進出貨單
router.get('/:id', auth.jwt, admin, getId)
// 管理者可以編輯進出貨單
router.patch('/:id', auth.jwt, admin, edit)
// 管理者可以刪除進出貨單
router.delete('/:id', auth.jwt, admin, remove)

export default router
