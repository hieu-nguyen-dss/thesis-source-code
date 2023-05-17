const { Router } = require('express')

const { learningActionController: controller } = require('../../controllers')
const { learningActionValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/:learningPathId/:lessonId/:lessonPartId')
  .post(verifyToken, validation.createActionValidate, controller.createAction)

router.route('/:learningPathId/:lessonId/:learningActionId')
  .put(verifyToken, validation.updateActionValidate, controller.updateAction)

router.route('/:learningPathId/:lessonId/:lessonPartId/:learningActionId')
  .delete(verifyToken, validation.deleteActionValidate, controller.deleteAction)

module.exports = router
