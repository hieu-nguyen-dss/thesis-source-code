const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createPart = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required()
  })
}

const deletePart = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    partId: Joi.string().required()
  })
}

module.exports = {
  createPartValidate: customValidate(createPart),
  deletePartValidate: customValidate(deletePart)
}
