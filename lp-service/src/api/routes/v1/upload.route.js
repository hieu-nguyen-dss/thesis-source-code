const { Router } = require('express')

const { uploadController: controller } = require('../../controllers')
const { uploadValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/:lessonId')
  .post(verifyToken, validation.uploadFileValidate, controller.uploadFile)
  .delete(verifyToken, validation.deleteFileValidate, controller.deleteFile)
router.route('/profile/avatar')
  .put(verifyToken, controller.changeAvatar)
router.route('/roadmaps/:roadmapId/steps/:roadmapStepId')
  .post(verifyToken, validation.uploadFileRoadmapValidate, controller.uploadFileRoadmap)
  .delete(verifyToken, validation.uploadFileRoadmapValidate, controller.deleteFileRoadmap)
router.route('/organizations/:ogzId/background')
  .put(verifyToken, validation.uploadBackgroundOgzValidate, controller.uploadBackgroundOgz)

module.exports = router
