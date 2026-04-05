const multer     = require('multer')
const path       = require('path')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder:         'chatcart/uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    public_id:      'cc_' + Date.now(),
  })
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/
    const ext     = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime    = allowed.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Only images allowed (jpg, png, webp)'))
  }
})

module.exports = upload
