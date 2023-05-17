const { Router } = require('express')

const { lessonPartController: controller } = require('../../controllers')
const { lessonPartValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/lesson/:lessonId')
  .post(verifyToken, validation.createPartValidate, controller.createLessonPart)
router.route('/lesson/:lessonId/lesson-part/:lessonPartId')
  .delete(verifyToken, validation.deletePartValidate, controller.deleteLessonPart)
  .put(verifyToken, validation.updatePartValidate, controller.updateLessonPart)

module.exports = router
