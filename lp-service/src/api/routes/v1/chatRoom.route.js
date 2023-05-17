const { Router } = require('express')
const { chatRoomController: controller } = require('../../controllers')

const { verifyToken } = require('../../middlewares')
const router = Router()

router.route('/:courseId/initiate').post(verifyToken, controller.initiate)
router.route('/:courseId/initiate').get(verifyToken, controller.getListRoomChat)

module.exports = router
