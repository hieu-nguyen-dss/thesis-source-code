const { Router } = require('express')

const { lessonController: controller } = require('../../controllers')
const { lessonValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router
  .route('/:learningPathId/:lessonId')
  .get(verifyToken, validation.getLessonValidate, controller.getLesson)

router.route('/:ogzId/:learningPathId/:lessonId')
  .get(verifyToken, validation.getOgzLessonValidate, controller.getOgzLesson)

router.route('/:partId').post(verifyToken, validation.createLessonValidate, controller.createLesson)

router
  .route('/:lessonId')
  .put(verifyToken, validation.updateLessonValidate, controller.updateLesson)

router
  .route('/:partId/:lessonId')
  .delete(verifyToken, validation.deleteLessonValidate, controller.deleteLesson)

module.exports = router
