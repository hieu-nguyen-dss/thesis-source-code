const { Router } = require('express')

const { quizController: controller } = require('../../controllers')
const { verifyToken } = require('../../middlewares')

const router = Router()

router
  .route('/:learningPathId/:lessonId')
  .get(verifyToken, controller.getQuizz)
  .post(verifyToken, controller.insertQuestions)

router
  .route('/answer/:quizzId/:studentId')
  .get(verifyToken, controller.getAnswer)
  .post(verifyToken, controller.storeResult)

module.exports = router
