const { Router } = require('express')

const {
  learningPathController: controller,
  participantController: controller2
} = require('../../controllers')
const { lpValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router
  .route('/')
  .post(verifyToken, validation.createLPValidate, controller.createLearningPath)
  .get(verifyToken, controller.getMyLPs)

router.route('/all').get(verifyToken, controller.getMyLPsAll)

router.route('/results').get(validation.searchLPValidate, controller.searchLearningPath)

router
  .route('/:learningPathId')
  .get(verifyToken, validation.getLPDetailValidate, controller.getLPDetail)
  .delete(verifyToken, validation.deleteLPValidate, controller.deleteLP)
  .post(verifyToken, validation.cloneLPValidate, controller.forkLP)
  .put(verifyToken, validation.updateLPValidate, controller.updateLP)

router
  .route('/:learningPathId/enroll')
  .delete(verifyToken, validation.cloneLPValidate, controller2.deleteStudentInCourse)
  .post(verifyToken, validation.cloneLPValidate, controller2.addStudentToCourse)
  .get(verifyToken, validation.cloneLPValidate, controller2.getStudentInCourse)

router.route('/:learningPathId/quiz/:quizId').get(verifyToken, controller.getQuizResult)

router
  .route('/:learningPathId/organization/:ogzId')
  .get(verifyToken, validation.getOgzLPDetailValidate, controller.getOgzLPDetail)

router
  .route('/:learningPathId/editors')
  .get(verifyToken, validation.getLPEditorsValidate, controller.getLPEditors)
  .post(verifyToken, validation.editEditorValidate, controller.addEditor)
  .delete(verifyToken, validation.editEditorValidate, controller.removeEditor)

router
  .route('/:learningPathId/stars')
  .post(verifyToken, validation.starLPValidation, controller.starLP)
  .delete(verifyToken, validation.starLPValidation, controller.unStarLP)

router.route('/:learningPathId/export').get(controller.exportCourse)

module.exports = router
