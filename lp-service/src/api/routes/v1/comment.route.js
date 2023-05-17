const { Router } = require('express')

const { commentController: controller } = require('../../controllers')
const { commentValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router
  .route('/course/:courseId/lesson/:lessonId/parent/:parentId?')
  .post(verifyToken, validation.commentLessonValidate, controller.commentLesson)

router
  .route('/course/:courseId/parent/:parentId?')
  .post(verifyToken, validation.commentCourseValidate, controller.commentCourse)

router
  .route('/roadmap/:roadmapId/parent/:parentId?')
  .post(verifyToken, validation.commentRoadmapValidate, controller.commentRoadmap)

router
  .route('/lesson/:lessonId/:commentId')
  .delete(verifyToken, validation.deleteCommentValidate, controller.deleteComment)

router.route('/:commentId').put(verifyToken, validation.editCommentValidate, controller.editComment)

router.route('/').get(verifyToken, validation.getCommentsValidate, controller.getComments)

module.exports = router
