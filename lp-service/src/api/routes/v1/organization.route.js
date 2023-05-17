const { Router } = require('express')

const { organizationController: controller } = require('../../controllers')
const { organizationValidation: validation } = require('../../validations')

const { verifyToken, verifyTokenQuery } = require('../../middlewares')

const router = Router()

router
  .route('/')
  .post(verifyToken, validation.createOrganizationValidate, controller.createOrganization)
  .get(verifyToken, controller.getMyOgzs)

router
  .route('/:ogzId')
  .post(verifyToken, validation.createLearningPathValidate, controller.createLearningPath)
  .put(verifyToken, validation.updateOrganizationValidate, controller.editOrganization)
  .delete(verifyToken, validation.deleteOrganizationValidate, controller.deleteOrganization)
  .get(verifyToken, validation.getOrganizationValidate, controller.getOrganization)

router
  .route('/:ogzId/members')
  .get(verifyToken, validation.getOrganizationValidate, controller.getMembers)
  .post(verifyToken, validation.memberOgzValidate, controller.addMember)
  .delete(verifyToken, validation.removeMemberValidate, controller.removeMember)

router
  .route('/:ogzId/learning-path/:learningPathId')
  .delete(verifyToken, validation.deleteLearningPathValidate, controller.deleteLearningPath)

router
  .route('/members/accept')
  .get(validation.acceptInviteValidate, verifyTokenQuery, controller.acceptInvite)

router.route('/:ogzId/members/role').put(verifyToken, validation.editRoleValidate, controller.editRole)

module.exports = router
