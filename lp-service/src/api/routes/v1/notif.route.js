const { Router } = require('express')

const { notifController: controller } = require('../../controllers')
const { notifValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/').get(verifyToken, validation.getNotifsValidate, controller.getNotifs)

module.exports = router
