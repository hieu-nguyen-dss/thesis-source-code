const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createRoadmap = {
  body: Joi.object({
    category: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string()
  })
}

const deleteRoadmap = {
  params: Joi.object({
    roadmapId: Joi.string().required()
  })
}

const updateRoadmap = {
  params: Joi.object({
    roadmapId: Joi.string().required()
  }),
  body: Joi.object({
    category: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    designedTime: Joi.number(),
    stars: Joi.array().items(Joi.string()),
    outcomes: Joi.object(),
    allowClone: Joi.boolean()
  })
}

const createStep = {
  params: Joi.object({
    roadmapId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    outcomes: Joi.array().items(Joi.object()),
    checklist: Joi.object(),
    startDate: Joi.date(),
    finishDate: Joi.date(),
    notify: Joi.boolean(),
    type: Joi.string().required()
  })
}

const updateStep = {
  params: Joi.object({
    roadmapId: Joi.string().required(),
    stepId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(''),
    type: Joi.string(),
    outcomes: Joi.array().items(Joi.object()),
    checklist: Joi.object(),
    startDate: Joi.date(),
    finishDate: Joi.date(),
    notify: Joi.boolean(),
    resources: Joi.array().items(Joi.object()),
    referenceLinks: Joi.array().items(Joi.object()),
    reminderBefore: Joi.number().min(1),
    updateChecklistType: Joi.string(),
    content: Joi.object(),
    ownerId: Joi.string()
  })
}

const deleteStep = {
  params: Joi.object({
    roadmapId: Joi.string().required(),
    stepId: Joi.string().required()
  })
}

const followRoadmap = {
  params: Joi.object({
    roadmapId: Joi.string().required()
  }),
  body: Joi.object({
    ownerId: Joi.string()
  })
}

const starRoadmap = {
  params: Joi.object({
    roadmapId: Joi.string().required()
  })
}

module.exports = {
  createRoadmapValidate: customValidate(createRoadmap),
  deleteRoadmapValidate: customValidate(deleteRoadmap),
  updateRoadmapValidate: customValidate(updateRoadmap),
  createStepValidate: customValidate(createStep),
  updateStepValidate: customValidate(updateStep),
  deleteStepValidate: customValidate(deleteStep),
  followRoadmapValidate: customValidate(followRoadmap),
  starRoadmapValidate: customValidate(starRoadmap)
}
