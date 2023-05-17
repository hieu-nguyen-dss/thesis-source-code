const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createAction = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    lessonId: Joi.string().required(),
    lessonPartId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    students: Joi.number(),
    online: Joi.boolean(),
    resources: Joi.object(),
    description: Joi.string().allow('', null),
    action: Joi.string(),
    time: Joi.number()
  })
}

const deleteAction = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    lessonId: Joi.string().required(),
    lessonPartId: Joi.string().required(),
    learningActionId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    isCompleted: Joi.boolean().required()
  })
}

const updateAction = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    lessonId: Joi.string().required(),
    learningActionId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    students: Joi.number(),
    online: Joi.boolean(),
    resources: Joi.object().allow(null),
    description: Joi.string(),
    action: Joi.string(),
    time: Joi.number(),
    completed: Joi.boolean()
  })
}

module.exports = {
  createActionValidate: customValidate(createAction),
  deleteActionValidate: customValidate(deleteAction),
  updateActionValidate: customValidate(updateAction)
}
