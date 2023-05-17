const { Router } = require('express')

const { analysisController, adminController } = require('../../controllers')
const { adminValidation: validation } = require('../../validations')

const router = Router()

router.route('/analysis/users').get(analysisController.countUsers)
router
  .route('/')
  .get(adminController.getAdminList)
  .delete(validation.deleteAccValidate, adminController.deleteAccount)

router.route('/analysis/top-statistics').get(analysisController.topStatistics)

router.route('/auth/login').post(validation.loginValidate, adminController.login)

router.route('/auth/signup').post(validation.signupValidate, adminController.signup)

module.exports = router
