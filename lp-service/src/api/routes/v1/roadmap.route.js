const { Router } = require('express')

const { roadmapController: controller } = require('../../controllers')
const { roadmapValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/')
  .get(verifyToken, controller.getMyRoadmaps)
  .post(verifyToken, validation.createRoadmapValidate, controller.createRoadmap)

router.route('/:roadmapId')
  .get(verifyToken, validation.deleteRoadmapValidate, controller.getRoadmapDetail)
  .post(verifyToken, validation.createStepValidate, controller.createStep)
  .put(verifyToken, validation.updateRoadmapValidate, controller.updateRoadmap)
  .delete(verifyToken, validation.deleteRoadmapValidate, controller.deleteRoadmap)

router.route('/:roadmapId/followers')
  .post(verifyToken, validation.followRoadmapValidate, controller.followRoadmap)
  .delete(verifyToken, validation.followRoadmapValidate, controller.unfollowRoadmap)

router.route('/:roadmapId/steps/:stepId')
  .put(verifyToken, validation.updateStepValidate, controller.updateStep)
  .delete(verifyToken, validation.deleteStepValidate, controller.deleteStep)

router.route('/:roadmapId/stars')
  .post(verifyToken, validation.starRoadmapValidate, controller.starRoadmap)
  .delete(verifyToken, validation.starRoadmapValidate, controller.unStarRoadmap)

module.exports = router
