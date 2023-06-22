const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createOrganization = {
  body: Joi.object({
    name: Joi.string().required(),
    ogzType: Joi.string().required(),
    description: Joi.string().allow('', null),
    imageLink: Joi.string()
  })
}

const updateOrganization = {
  params: Joi.object({
    ogzId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    admin: Joi.string(),
    description: Joi.string().allow(''),
    backgroundImg: Joi.string().allow(''),
    address: Joi.string().allow(''),
    email: Joi.string().allow(''),
    category: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    foundDate: Joi.date().allow(null)
  })
}

const getOrganization = {
  params: Joi.object({
    ogzId: Joi.string().required()
  })
}

const deleteOrganization = {
  params: Joi.object({
    ogzId: Joi.string().required()
  })
}

const createLearningPath = {
  params: Joi.object({
    ogzId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().empty(),
    ownerType: Joi.string().required(),
    semaster: Joi.string().empty(),
    startDate: Joi.string().empty(),
    endDate: Joi.string().empty(),
    participants: Joi.array().required()
  })
}

const deleteLearningPath = {
  params: Joi.object({
    ogzId: Joi.string().required(),
    learningPathId: Joi.string().required()
  })
}

const memberOgz = {
  params: Joi.object({
    ogzId: Joi.string().required()
  }),
  body: Joi.object({
    user: Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      id: Joi.string(),
      avatar: Joi.string(),
      totalLp: Joi.number()
    }),
    role: Joi.string().required()
  })
}

const removeMember = {
  params: Joi.object({
    ogzId: Joi.string().required()
  }),
  body: Joi.object({
    userId: Joi.string().required()
  })
}

const acceptInvite = {
  query: Joi.object({
    token: Joi.string()
  })
}

const editRole = {
  params: Joi.object({
    ogzId: Joi.string().required()
  }),
  body: Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().required()
  })
}

module.exports = {
  createOrganizationValidate: customValidate(createOrganization),
  updateOrganizationValidate: customValidate(updateOrganization),
  getOrganizationValidate: customValidate(getOrganization),
  deleteOrganizationValidate: customValidate(deleteOrganization),
  createLearningPathValidate: customValidate(createLearningPath),
  deleteLearningPathValidate: customValidate(deleteLearningPath),
  memberOgzValidate: customValidate(memberOgz),
  acceptInviteValidate: customValidate(acceptInvite),
  editRoleValidate: customValidate(editRole),
  removeMemberValidate: customValidate(removeMember)
}
