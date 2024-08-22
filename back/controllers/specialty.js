import Specialty from '../models/specialty.js'
import { StatusCodes } from 'http-status-codes'
// 使用 validator 來驗證 ID 是否為有效的 MongoDB ID
// 在 edit 方法中，我們需要驗證 req.params.id 是否為有效的 MongoDB ID。
// if (!validator.isMongoId(req.params.id)) throw new Error('ID')
import validator from 'validator'

// 管理者創建商品
// router.post('/', auth.jwt, admin, upload, create)
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
    const result = await Specialty.create(req.body)
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
// 0716/ 04:11:40
// 管理者取得全部商品，回應給 v-data-table-server 格式的資料
// router.get('/all', auth.jwt, admin, getAll)
// getAll 取全部的資料處理比較麻煩，因為前端會送很多資料過來，要依照資料去做排序，一一接過來處理
export const getAll = async (req, res) => {
  try {
    // 這裡的所有 const 都是對應 admin/product.vue 的 v-data-table-server 所綁定的變數，
    // 可以看 0716/ 03:55:20
    // 根據查詢參數來篩選、排序、分頁顯示產品資料。
    // sortBy: 用來決定排序的欄位，預設為 createdAt (產品創建日期)。
    // 這裡改成依照價格排序(高到低)

    // 0716/ 04:13:05 sortBy 使用 req.query(網址後面的參數).sortBy 去接，
    // query 收到的都會是文字，要轉成數字
    // 因為有設定兩個欄位 key、order。所以兩個欄位都要去接
    // || 是給預設值，當沒有就用預設
    const sortBy = req.query.sortBy || 'price'
    // sortOrder: 排序順序，預設為 desc（倒序排序）。
    // mongoDB 排序的 order 是 1 或是 -1，所以前端傳過來也使用 1 或 -1
    const sortOrder = req.query.sortOrder || 'desc'
    // itemsPerPage: 每頁顯示的項目數量，預設為 10。(itemsPerPage * 1 轉數字)
    // 0716/ 04:15:10 如果前端東西很多可以使用套件 yup 的 cast
    const itemsPerPage = req.query.itemsPerPage * 1 || 10
    // page: 當前頁數，預設為 1。
    // req.query.page * 1 轉數字。
    const page = req.query.page * 1 || 1
    // 0716/ 04:19:00 因為有使用 tableSearch，文字要自己改寫(將前端傳過來的文字使用正則表達式去做)，不然就只會顯示搜尋完全符合的文字
    // 使用搜尋欄位時: const tableSearch = ref('')
    // regex: 之前都是使用寫好的方法去寫，這裡使用物件 new RegExp 建立一個正則表達式的物件，
    // 將 'req.query.search' 放進正則表達式的物件，
    // || '' 或是空的
    // 'i' 為不分大小寫，就可把各個選項給寫出來，寫完之後使用查詢 const data = await Product
    const regex = new RegExp(req.query.search || '', 'i')

    // 0716/ 04:20:45
    // 定義查詢 const data = await Product，回應的 data 資料
    const data = await Specialty
    // .find: 裡面放查詢條件，查詢產品資料，條件為商品名稱或商品描述中包含搜尋關鍵字。
      .find({
        // 使用 $or (符合其中一個就可以): 表示查詢條件為 name 或 description 都要符合上面定義的 regex 的資料。
        $or: [
          { name: regex },
          { description: regex }
        ]
      })
      // 0716/ 04:22:20 找出來搜尋的後，做排序 .sort
      // MongoDB 可以照很多種去排序，但方法不太一樣
      // 可以看 mongoose .sort 官方文件: 把變數的值當作 obj 的 key 去使用。
      // const text = 'a' ，變數 a
      // const obj = { [text]: 1 } ，物件 { [text]: 1 }
      // obj.a --> 1
      // [sortBy]當作輸入的 key 加上中括號: sortOrder 放在 .sort({...})
      .sort({ [sortBy]: sortOrder })
      // 0716/ 03:59:50 這裡要注意後端要怎麼回應給前端一頁幾個、第幾筆到第幾筆的資料，
      // 這裡所回應的是 v-data-table-server 定義 v-model:page="tablePage" 時所顯示的資料。
      // 03:59:45 思考如何後端要怎麼用 "每頁幾個、現在第幾頁..." 來判斷現在要回給前端第幾筆到第幾筆的資料。

      // 0716/ 04:26:10 ~ 04:29:30 排序後寫分頁: .skip() 跳過幾筆資料、.limit() 要回傳幾筆資料
      // 因為前端只回傳 "一頁幾個 itemsPerPage"、"現在第幾頁 page"，所以要使用 page、itemPerPage 去計算要跳過幾筆
      // 要看 v-model 有綁定的資料，代表前端回傳的資料 items-per-page、page
      // 第一頁 = 1 ~ 10 = 跳過 0 筆 = (第 1 頁 - 1) * 10 = 0
      // 第二頁 = 11 ~ 20 = 跳過 10 筆 = (第 2 頁 - 1) * 10 = 10
      // 第三頁 = 21 ~ 30 = 跳過 20 筆 = (第 3 頁 - 1) * 10 = 20
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)

    // 0716/ 04:30:30 告訴前端總共有幾筆資料，因為前端有設 tableItemsLength(顯示在 data-table 下面翻頁的地方)
    // 顯示後端總共有幾筆資料也要一併回傳給前端，
    // 0716/ 04:30:55 舉例: 算東西的方法有很多種(.find 所有 sell: true 的東西)取.length 就可以知道有幾筆

    // 0716/ 04:31:30 Mongoose 有方法: 計算資料總數(全部有幾筆) estimatedDocumentCount()
    // 如果需要做過濾的話，就要用 countDocument()
    const total = await Specialty.estimatedDocumentCount() // 用來計算 Product collection 中有多少筆資料
    // 取出資料後可以坐回傳動作
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        // 把上面的 data, total 回給前端
        data, total
      }
    })
    // 錯誤處理 "未知錯誤"
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 07/16 05:04:45
// 管理者編輯商品功能，要使用到 validator 驗證 ID 是否為有效的 MongoDB ID。
// router.patch('/:id', auth.jwt, admin, upload, edit)
// async await 用于等待一个 Promise 對象的解析（resolve）
export const edit = async (req, res) => {
  try {
    // 如果 req.params.id 不是有效的 MongoDB ID，拋出錯誤 throw new Error('ID')
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    // 07/16 05:05:40
    // 使用 ?. 因為編輯可能沒有要新增圖片，如果值為 null 就不會換掉，
    // 可以去參考上面 create 的方法 :
    // 將上傳的圖片路徑存儲在 req.body.image 中，因為 multer 會將文件信息（例如文件路徑）存放在 req.file 中。
    // 這一行的作用是將圖片的存儲路徑附加到 req.body 中
    req.body.image = req.file?.path
    // 使用了 Mongoose 的 .findByIdAndUpdate 方法，透過 ID 查找商品，然後更新商品資料。
    // .findByIdAndUpdate 方法，接受三个参数：
    // 1. req.params.id ( 資料庫裡面的 _id。通常是從请求的 URL 参数中提取的，例如 /products/:id 中的 id )
    // 2. req.body 代表要更新的數據，透過 HTTP 请求發送的數據。
    // 3. { runValidators: true }：一個選項物件。 true 代表要執行 schema 定義的驗證器。

    // req.params.id 換成 req.body，然後 { runValidators: true } 要先執行驗證才可以
    // 如果失敗可能資料庫沒有這個要編輯的東西 .orFail(new Error('NOT FOUND'))
    await Specialty.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    // error.name === 'CastError' 代表 Mongoose 抛出的 CastError 错误。
    // error.message === 'ID' 代表上面自己寫的錯誤訊息。
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

// 所有人都可以看到上架商品
// router.get('/', get)
// 0717/ 00:23:25 Pagination 分頁元件，直接複製 getAll 寫好的方法，增加 sell 為 true 的條件。
// 因為 getAll 有分頁、搜尋，所以直接複製 getAll 的方法，只是不用經過 auth.jwt、admin
// 自己計算頁數、有 v-model

// 這裡 get 只要把資料傳回去就好，不用做分頁、搜尋、只需要 .find({ sell: true })
export const get = async (req, res) => {
  try {
    // 這裡的所有 const 都是對應 admin/product.vue 的 v-data-table-server 所綁定的變數，
    // 可以看 0716/ 03:55:20
    // 根據查詢參數來篩選、排序、分頁顯示產品資料。
    // sortBy: 用來決定排序的欄位，預設為 createdAt (產品創建日期)。
    // 這裡改成依照價格排序(高到低)

    // 0716/ 04:13:05
    // sortBy 使用 req.query(網址後面的參數).sortBy 去接，
    // query 收到的都會是文字，要轉成數字
    // 因為有設定兩個欄位 key、order。所以兩個欄位都要去接
    // || 是給預設值，當沒有就用預設
    // const sortBy = req.query.sortBy || 'price'
    // sortOrder: 排序順序，預設為 desc（倒序排序）。
    // mongoDB 排序的 order 是 1 或是 -1，所以前端傳過來也使用 1 或 -1
    // const sortOrder = req.query.sortOrder || 'desc'
    // itemsPerPage: 每頁顯示的項目數量，預設為 10。(itemsPerPage * 1 轉數字)
    // 0716/ 04:15:10 如果前端東西很多可以使用套件 yup 的 cast
    // const itemsPerPage = req.query.itemsPerPage * 1 || 10
    // page: 當前頁數，預設為 1。
    // req.query.page * 1 轉數字。
    // const page = req.query.page * 1 || 1
    // 0716/ 04:19:00 因為有使用 tableSearch，文字要自己改寫(將前端傳過來的文字使用正則表達式去做)，不然就只會顯示搜尋完全符合的文字
    // 使用搜尋欄位時: const tableSearch = ref('')
    // regex: 之前都是使用寫好的方法去寫，這裡使用物件 new RegExp 建立一個正則表達式的物件，
    // 將 'req.query.search' 放進正則表達式的物件，
    // || '' 或是空的
    // 'i' 為不分大小寫，就可把各個選項給寫出來，寫完之後使用查詢 const data = await Product
    // const regex = new RegExp(req.query.search || '', 'i')

    // 0716/ 04:20:45
    // 定義查詢 const data = await Product，回應的 data 資料
    const data = await Specialty
    // .find: 裡面放查詢條件，查詢產品資料，條件為商品名稱或商品描述中包含搜尋關鍵字。
      .find({

        // 0717/ 00:23:25
        // 增加 sell 為 true` 的條件，表示只顯示上架商品。
        sell: true
        // 使用 $or (符合其中一個就可以): 表示查詢條件為 name 或 description 都要符合上面定義的 regex 的資料。
        // $or: [
        //   { name: regex },
        //   { description: regex }
        // ]
      })
      // 0716/ 04:22:20 找出來搜尋的後，做排序 .sort
      // MongoDB 可以照很多種去排序，但方法不太一樣
      // 可以看 mongoose .sort 官方文件: 把變數的值當作 obj 的 key 去使用。
      // const text = 'a' ，變數 a
      // const obj = { [text]: 1 } ，物件 { [text]: 1 }
      // obj.a --> 1
      // [sortBy]當作輸入的 key 加上中括號: sortOrder 放在 .sort({...})
      // .sort({ [sortBy]: sortOrder })
      // 0716/ 03:59:50 這裡要注意後端要怎麼回應給前端一頁幾個、第幾筆到第幾筆的資料，
      // 這裡所回應的是 v-data-table-server 定義 v-model:page="tablePage" 時所顯示的資料。
      // 03:59:45 思考如何後端要怎麼用 "每頁幾個、現在第幾頁..." 來判斷現在要回給前端第幾筆到第幾筆的資料。

    // 0716/ 04:26:10 ~ 04:29:30 排序後寫分頁: .skip() 跳過幾筆資料、.limit() 要回傳幾筆資料
    // 因為前端只回傳 "一頁幾個 itemsPerPage"、"現在第幾頁 page"，所以要使用 page、itemPerPage 去計算要跳過幾筆
    // 要看 v-model 有綁定的資料，代表前端回傳的資料 items-per-page、page
    // 第一頁 = 1 ~ 10 = 跳過 0 筆 = (第 1 頁 - 1) * 10 = 0
    // 第二頁 = 11 ~ 20 = 跳過 10 筆 = (第 2 頁 - 1) * 10 = 10
    // 第三頁 = 21 ~ 30 = 跳過 20 筆 = (第 3 頁 - 1) * 10 = 20
    // .skip((page - 1) * itemsPerPage)
    // .limit(itemsPerPage)

    // 0716/ 04:30:30 告訴前端總共有幾筆資料，因為前端有設 tableItemsLength(顯示在 data-table 下面翻頁的地方)
    // 顯示後端總共有幾筆資料也要一併回傳給前端，
    // 0716/ 04:30:55 舉例: 算東西的方法有很多種(.find 所有 sell: true 的東西)取.length 就可以知道有幾筆

    // 0716/ 04:31:30 Mongoose 有方法: 計算資料總數(全部有幾筆) estimatedDocumentCount()
    // 如果需要做過濾的話，就要用 countDocument()
    // 0717 00:43:00 改成 countDocuments()，才會只顯示上架商品
    // const total = await Product.countDocuments({ sell: true })
    // 取出資料後可以做回傳動作
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        // 把上面的 data, total 回給前端
        data
      }
    })
    // 錯誤處理 "未知錯誤"
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 所有人都可以點進去看單一商品介紹
// router.get('/:id', getId)
// 0717/ 00:25:30
// 把指定 id 商品丟出去，像是做 edit 的時候，要先檢查 id 是否為有效的 MongoDB ID
export const getId = async (req, res) => {
  try {
    // 從 edit 方法抓近來，檢查 id 是否為有效的 MongoDB ID
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // 取商品 Product (models/product.js)
    // req.params.id 是 Express.js 中用來訪問 URL 路徑參數的一種方式
    // .findById(req.params.id) 透過 ID 查找商品
    // .orFail(new Error('NOT FOUND')) 如果找不到商品，拋出錯誤 'NOT FOUND'
    const result = await Specialty.findById(req.params.id).orFail(new Error('NOT FOUND'))
    // 將商品資料返回給前端 result
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
    // 複製 ID 相關的錯誤處理，拿掉驗證 ValidationError 的部分,因為找登溪不會有驗證
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

// 0717/ 00:29:30 都寫完 product 的方法以後，就可以去前端寫 index.vue 裡面顯示 Product 的方法。
// 注意前端傳入的參數，要跟後端的參數一樣，才能正確顯示。
