const { Router } = require('express')

const { upload, verifyToken } = require('../../middlewares')
const router = Router()

router.route('/').post(verifyToken, upload.fileUpload.single('resource'), upload.cloudinaryUpload)

module.exports = router
