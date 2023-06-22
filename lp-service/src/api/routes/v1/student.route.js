const { Router } = require('express')

const { studentController: controller } = require('../../controllers')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/students').get(verifyToken, controller.getStudents)

module.exports = router
