const { Router } = require('express')

const { partController: controller } = require('../../controllers')
const { partValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router
  .route('/:learningPathId')
  .post(verifyToken, validation.createPartValidate, controller.createPart)

router
  .route('/:learningPathId/:partId')
  .delete(verifyToken, validation.deletePartValidate, controller.deletePart)
module.exports = router
