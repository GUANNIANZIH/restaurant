import Revenue from '../models/revenue.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 建立營收項目:
// 當管理者在前端提交一個新增營收項目的請求時，該請求會被送至這裡進行處理。
export const create = async (req, res) => {
  try {
    // 檢查所有必填字段是否存在
    const { itemName, quantity, date, typeField, totalAmount } = req.body

    if (!itemName || !quantity || !date || !typeField || totalAmount === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '所有字段都是必填的'
      })
    }
    // 創建新的 Revenue 實例並保存到數據庫
    const revenue = new Revenue({ itemName, quantity, date, typeField, totalAmount })
    await revenue.save()

    // 操作成功，回傳 200 OK 狀態碼和結果
    res.status(StatusCodes.OK).json({
      success: true,
      message: '營收項目新增成功',
      result: revenue
    })
  } catch (error) {
    // 捕捉錯誤並回傳 400 Bad Request 或 500 Internal Server Error
    console.error(error)
    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 取得所有營收項目 :
// 用來檢索返回資料庫中所有的營收項目，通常會在前端的數據表格(如管理者後台營收 data-table-server)顯示。
export const getAll = async (req, res) => {
  try {
    // 取得查詢參數，並設置預設值
    // sortBy 使用 req.query(網址後面的參數).sortBy 去接，
    const sortBy = req.query.sortBy || 'date'
    // sortOder 參數用來指定排序順序，默認為降序(desc)
    const sortOrder = req.query.sortOrder || 'desc'
    // itemsPerPage: 每頁顯示的項目數量，預設為 10。
    // itemsPerPage * 1，如果 itemsPerPage 是字串，這樣就可以轉成數字。
    const itemsPerPage = parseInt(req.query.itemsPerPage * 1) || 10
    // parseInt(req.query.page, 10) 代表取得網址後面的 page 參數，如果沒有就預設為 1。
    const page = parseInt(req.query.page, 10) || 1
    // 因為有使用 tableSearch，文字要自己改寫(將前端傳過來的文字使用正則表達式去做)
    // 使用物件 new RegExp 建立一個正則表達式的物件，
    // 將 'req.query.search' 放進正則表達式的物件，
    // || '' 或是空的
    // 'i' 為不分大小寫，就可把各個選項給寫出來，寫完之後使用查詢 const data = await Product
    const regex = new RegExp(req.query.search || '', 'i')

    // 定義查詢 const data = await Product，回應的 data 資料
    const data = await Revenue
    // .find: 裡面放查詢條件，查詢產品資料，條件為商品名稱或商品描述中包含搜尋關鍵字。
      .find({
        // 使用 $or (符合其中一個就可以):
        // 表示查詢條件為 item 或 type 都要符合上面定義的 regex 的資料。
        $or: [
          { itemName: regex },
          { typeField: regex }
        ]
      })
    // 根據 sortBy 和 sortOrder 進行排序
      .sort({ [sortBy]: sortOrder })
    // .skip() 跳過幾筆資料、.limit() 要回傳幾筆資料
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
    // Mongoose 有方法: 計算資料總數(全部有幾筆) estimatedDocumentCount()
    // 用來計算 Revenue collection 中有多少筆資料
    // 如果需要做過濾的話，就要用 countDocument()
    const total = await Revenue.estimatedDocumentCount()
    // 取出資料後可以做回傳動作
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        // 把上面的 data, total 回給前端
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

// 取得單一營收項目:
// 根據指定 ID 檢索特定營收項目，通常會使用在前端需要顯示或編輯單個項目的情況。
export const getId = async (req, res) => {
  try {
    // 從 req.params.id 中獲取 URL 中的 ID 參數。
    // 使用該 ID 在資料庫中查找對應的 Revenue 文檔。
    const revenue = await Revenue.findById(req.params.id)
    if (!revenue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '營收項目不存在'
      })
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: revenue
    })
  } catch (error) {
    // 如果出現其他錯誤，返回 HTTP 狀態碼 500 Internal Server Error 並附帶錯誤訊息。
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 編輯營收項目:
// 根據指定 id 編輯已經存在的營收項目，通常會在管理者修改營收項目時使用。
export const edit = async (req, res) => {
  try {
    // 如果 req.params.id 不是有效的 MongoDB ID，拋出錯誤 throw new Error('ID')
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // req.params.id 換成 req.body，然後 { runValidators: true } 要先執行驗證才可以
    // 如果失敗可能資料庫沒有這個要編輯的東西 .orFail(new Error('NOT FOUND'))
    await Revenue.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND'))
    res.status(StatusCodes.OK).json({
      success: true,
      message: '營收項目編輯成功'
    })
  } catch (error) {
    if (error.message === 'ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的 ID'
      })
      // 0716/ 05:09:35 驗證錯誤複製 create 的驗證錯誤的訊息回傳
      // Mongoose 的 ValidationError 錯誤，通常在資料不符合模型定義的驗證規則時拋出。
    } else if (error.name === 'ValidationError') {
      // error.errors 是一個物件，包含了所有驗證失敗的的字句。
      // Object.keys(error.errors) 返回一個包含所有錯誤鍵的陣列。
      // [0] 表示取陣列中的第一個元素，這通常是第一個出現錯誤的欄位名稱。
      const key = Object.keys(error.errors)[0]
      // 取出錯誤訊息 message，代表驗證失敗的原因。
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

// 允許管理者通過前端請求刪除特定的營收項目，並確保在出現錯誤時能夠適當處理和回應。
export const remove = async (req, res) => {
  try {
    // 使用 findByIdAndDelete 方法根據 req.params.id 來查找並刪除指定的營收項目。
    const revenue = await Revenue.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))
    // 如果 revenue 項目不存在，則回應 404 Not Found
    if (!revenue) {
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
