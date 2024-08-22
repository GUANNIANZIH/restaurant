// 0717 03:18:40
import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
// 訂單需要 create, getAll, get
import { create, createSpecialty, get, getSpecialty, getAll, getAllSpecialty, getAllOrderProgress, updateStatus, updateStatusSpecialty, getStatusList, getStatusListSpecialty, completeOrder, completeOrderSpecialty } from '../controllers/order.js'

const router = Router()

// 1. 建立訂單
// create 要新增訂單的話先登入 auth.jwt, create
router.post('/', auth.jwt, create)
router.post('/specialty', auth.jwt, createSpecialty)
// 2. get 取自己的訂單
router.get('/', auth.jwt, get)
router.get('/specialty', auth.jwt, getSpecialty)
// 3. 管理員可以取得所有訂單
router.get('/all', getAllOrderProgress)
router.get('/all', auth.jwt, admin, getAll)
router.get('/allSpecialty', auth.jwt, admin, getAllSpecialty)
// 4. 管理員更新訂單狀態
router.patch('/all', auth.jwt, admin, updateStatus)
router.patch('/allSpecialty', auth.jwt, admin, updateStatusSpecialty)

router.get('/all', auth.jwt, admin, getStatusList)
router.get('/allSpecialty', auth.jwt, admin, getStatusListSpecialty)

// 5. 管理者可以刪除取消的訂單
router.patch('/all', auth.jwt, admin, completeOrder)
router.patch('/all', auth.jwt, admin, completeOrderSpecialty)

export default router
