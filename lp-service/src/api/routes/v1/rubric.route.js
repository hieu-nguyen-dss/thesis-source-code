const { Router } = require('express')

const { rubricController: controller } = require('../../controllers')
const { rubricValidation: validation } = require('../../validations')
const { verifyToken } = require('../../middlewares')

const router = Router()

router.route('/learning-path/:learningPathId')
  .post(verifyToken, validation.createRubricValidate, controller.createRubric)
  .get(verifyToken, validation.getLPRubricsValidate, controller.getLPRubrics)
router.route('/learning-path/:learningPathId/rubric/:rubricId')
  .delete(verifyToken, validation.deleteRubricValidate, controller.deleteRubric)
router.route('/:rubricId')
  .put(verifyToken, validation.updateRubricValidate, controller.updateRubric)
  .get(verifyToken, validation.getRubricValidate, controller.getRubric)
router.route('/learning-path/:learningPathId/organization/:ogzId')
  .get(verifyToken, validation.getOgzLPRubricsValidate, controller.getOgzLPRubrics)
module.exports = router
