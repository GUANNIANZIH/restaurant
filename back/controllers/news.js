import news from '../models/news.js'
// 狀態碼
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 創建公告
export const create = async (req, res) => {
  try {
    // 0716/ 01:14:30
    // 如果直接寫 await Product.create(req.body)，
    // 這樣圖片不會在裡面，因為圖片是 req.file.path
    // 這裡的 image 對應到 models/product.js 的 image

    // 將上傳的圖片路徑存儲在 req.body.image 中。
    // multer 會將文件信息（例如文件路徑）存放在 req.file 中。
    // 這一行的作用是將圖片的存儲路徑附加到 req.body 中
    req.body.image = req.file.path
    // const result
    // 使用 Product 模型的 create 方法將 req.body 中的所有數據存儲到數據庫中
    const result = await news.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    // 0716/ 01:15:10
    // 錯誤的地方可能會發生驗證錯誤，直接複製使用者的錯誤訊息回傳。
    // 因為沒有唯一性約束 (unique) 的情況，所以不會出現 MongoServerError
    // 所以只會出現 ValidationError、500 INTERNAL_SERVER_ERROR 內部伺服器錯誤

    // error.name === 'ValidationError': 這裡檢查 error 物件的名稱是否為 'ValidationError'。
    // 'ValidationError' 是 mongoose 的錯誤，通常在資料不符合模型定義的驗證規則時拋出。
    // 因為有引用 Product 的模型，在 Product 的模型中有設定驗證規則，所以這裡會拋出 ValidationError。
    if (error.name === 'ValidationError') {
      // 取出錯誤的第一個東西取出
      // Object.keys(error.errors)[0]: error.errors 是一個物件，包含了所有的驗證錯誤。
      // Object.keys(error.errors) 會返回這個物件的所有鍵組成的陣列，[0] 表示取出第一個鍵，這通常是第一個出現錯誤的欄位名稱。
      // error.errors[key].message: 取得對應錯誤欄位的錯誤訊息，這訊息通常描述了驗證失敗的原因。
      const key = Object.keys(error.errors)[0]
      // 再去取出錯誤的訊息
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
}

// 取得全部公告
export const getAll = async (req, res) => {
  try {
    // 在資料庫裡面的建立日期 key "createdAt"
    const sortBy = req.query.sortBy || 'createdAt'
    // 'desc' 要轉成 MongoDB 的倒敘排序 (1, -1)
    const sortOrder = req.query.sortOrder || 'desc'
    // 一頁有幾筆資料
    const itemsPerPage = req.query.itemsPerPage * 1 || 10
    // 第幾頁
    const page = req.query.page * 1 || 1
    // 搜尋的關鍵字，搜尋使用正則表達式，不分大小寫用 'i'
    const regex = new RegExp(req.query.search || '', 'i')

    const data = await news
      .find({
        $or: [
          { title: regex },
          { content: regex }
        ]
      })
    // const text = 'a'
    // const obj = { [text]: 1 }
    // obj.a --> 1
      .sort({ [sortBy]: sortOrder })
    // 如果一頁有 10 筆
    // 第一頁 = 1 ~ 10 = 跳過 0 筆 = (第 1 頁 - 1) * 10 = 0
    // 第二頁 = 11 ~ 20 = 跳過 10 筆 = (第 2 頁 - 1) * 10 = 10
    // 第三頁 = 21 ~ 30 = 跳過 20 筆 = (第 3 頁 - 1) * 10 = 20
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)

    const total = await news.estimatedDocumentCount()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
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

// 編輯公告
export const edit = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    // ?.不一定要更換圖片
    req.body.image = req.file?.path
    await news.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '文章 ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無文章'
      })
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
}

// 所有人都可以看到所有文章 - 顯示方法要改用 card 呈現
// router.get('/', get)
export const get = async (req, res) => {
  try {
    // const sortBy = req.query.sortBy || 'createdAt'
    // const sortOrder = req.query.sortOrder || 'desc'
    // const itemsPerPage = req.query.itemsPerPage * 1 || 10
    // const page = req.query.page * 1 || 1
    // const regex = new RegExp(req.query.search || '', 'i')

    const data = await news
      .find({
        isPublished: true
        // $or: [
        //   { name: regex },
        //   { description: regex }
        // ]
      })
    // const text = 'a'
    // const obj = { [text]: 1 }
    // obj.a --> 1
      // .sort({ [sortBy]: sortOrder })
    // 如果一頁有 10 筆
    // 第一頁 = 1 ~ 10 = 跳過 0 筆 = (第 1 頁 - 1) * 10 = 0
    // 第二頁 = 11 ~ 20 = 跳過 10 筆 = (第 2 頁 - 1) * 10 = 10
    // 第三頁 = 21 ~ 30 = 跳過 20 筆 = (第 3 頁 - 1) * 10 = 20
      // .skip((page - 1) * itemsPerPage)
      // .limit(itemsPerPage)

    // const total = await news.countDocuments({ sell: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data
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

// 所有人都可以點進去看單一文章介紹
// router.get('/:id', getId)
export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const result = await news.findById(req.params.id).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
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
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const remove = async (req, res) => {
  try {
    // 使用 findByIdAndDelete 方法根據 req.params.id 來查找並刪除指定的營收項目。
    const postNews = await news.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))
    // 如果 revenue 項目不存在，則回應 404 Not Found
    if (!postNews) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '營收項目不存在'
      })
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '營收項目刪除成功'
    //  刪除操作不需要回傳 result 資料
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
