import UserRole from '../enums/UserRoles.js'
import { StatusCodes } from 'http-status-codes'

// 0716/ 01:04:20
// 這裡寫完使用者權限設定以後，再回到 routes/product.js
//  || req.user.role !== UserRole.EMPLOYEE
export default (req, res, next) => {
  if (req.user.role !== UserRole.EMPLOYEE && req.user.role !== UserRole.ADMIN) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: '沒有權限'
    })
  } else {
    next()
  }
}
