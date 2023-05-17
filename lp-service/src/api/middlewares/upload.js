const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const fileUpload = multer()

cloudinary.config({
  cloud_name: 'datznywwq',
  api_key: '115541464349358',
  api_secret: 'K-bEghA41d6A-ucr_sTtXfIpKHE'
})

const cloudinaryUpload = (req, res, next) => {
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(error)
          }
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    // eslint-disable-next-line no-inner-declarations
    async function uploadStream(req) {
      const result = await streamUpload(req)
      console.log(result)
    }
    uploadStream(req)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fileUpload,
  cloudinaryUpload
}
