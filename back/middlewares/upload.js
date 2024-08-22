// 這裡要來寫上傳檔案的 middleware
// 0626 lesson
//  cloudinary 設定檔案要接收甚麼格式檔案、檔案尺寸，
// 再寫一個 middleware 用來當上傳檔案超出格式或尺寸時要做甚麼?
import multer from 'multer'
// 指定版本 v2 作為 cloudinary 這個變數名稱來使用
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// 0626 lesson
// 檔案上傳幾乎都在寫 "設定"，不會像 passport 一樣跳來跳去，
// 但是需要先認證完以後，才可以上傳檔案，第一步驟為先設定 "檔案上傳的平台 Cloudinary"；
// 第二步驟為設定 "上傳套件 multer"

// 設定 cloudinary 上傳平台
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// 設定 "使用上傳套件 multer - 上傳格式設定"
// 0716 00:49:45 如果有特殊檔案要上船要去看 cloudinary 支不支援
const upload = multer({
  // 先設定 storage 代表收到檔案後。放在 cloudinary。
  storage: new CloudinaryStorage({ cloudinary }),
  // 設定 fileFilter, (req, file, callback)
  // req 收到的請求, file 收到的檔案, callback 處理的結果要呼叫 callback 才算處理完成。
  // 概念類似 next()。做完之後呼叫 callback() 就知道處理完成。
  fileFilter (req, file, callback) {
    console.log(file)
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // 如果陣列有符合我們 "媒體類型的 file",就 callback(null, true) 代表通過。
      callback(null, true)
    } else {
      // 拋出的錯誤, 否允許上傳
      callback(new Error('FORMAT'), false)
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024 // 代表 3MB，看一下自己要上傳的圖片大小
  }
})

// export default (req, res, next) 定義檔案欄位名稱為 image
export default (req, res, next) => {
  // 0716/ 00:53:30
  // 跟 0626 lesson 差別在欄位名稱改叫 image
  // 0626 lesson 因為現在只有接收一個大頭照，所以 upload.single('avatar')
  upload.single('image')(req, res, error => { // upload.single 接收一個 image 欄位的檔案
    if (error instanceof multer.MulterError) {
      let message = '檔案太大'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      }
      // 狀態碼 BAD_REQUEST 代表錯誤的請求
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
    // 代表上面的 FORMAT，callback(new Error('FORMAT'), false)
      if (error.message === 'FORMAT') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '檔案格式錯誤'
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      }
      // 沒有問題就下一步 next()。
    } else {
      next()
    }
  })
}
