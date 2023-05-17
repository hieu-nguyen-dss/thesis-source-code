const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createPart = {
  params: Joi.object({
    lessonId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required()
  })
}

const deletePart = {
  params: Joi.object({
    lessonId: Joi.string().required(),
    lessonPartId: Joi.string().required()
  }),
  body: Joi.object({
    learningActionIds: Joi.array().items(
      Joi.string()
    ),
    name: Joi.string().required()
  })
}

const updatePart = {
  params: Joi.object({
    lessonPartId: Joi.string().required(),
    lessonId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    learningActions: Joi.array().items(
      Joi.string()
    )
  })
}

module.exports = {
  createPartValidate: customValidate(createPart),
  deletePartValidate: customValidate(deletePart),
  updatePartValidate: customValidate(updatePart)
}
