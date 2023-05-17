const { Router } = require('express')

const { userController: controller } = require('../../controllers')
const { userValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/all')
  .get(verifyToken, validation.getUsersListValidate, controller.getListUser)

router.route('/delete')
  .delete(verifyToken, validation.deleteUserValidate, controller.deleteUser)

router
  .route('/login')
  .post(validation.loginValidate, controller.login)

router
  .route('/signup')
  .post(validation.signupValidate, controller.signup)

router.route('/detail')
  .get(verifyToken, validation.getUsersValidate, controller.getUsers)
  
router.route('/result')
  .get(validation.getUsersByEmailValidate, controller.getUsersByEmail)

module.exports = router
