const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const createRubric = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    tree: Joi.array().items(Joi.object()).required(),
    rows: Joi.object()
  })
}

const updateRubric = {
  params: Joi.object({
    rubricId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    tree: Joi.array().items(Joi.object()).required(),
    rows: Joi.object()
  })
}

const getRubric = {
  params: Joi.object({
    rubricId: Joi.string().required()
  })
}

const getLPRubrics = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  })
}

const getOgzLPRubrics = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    ogzId: Joi.string().required()
  })
}

const deleteRubric = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    rubricId: Joi.string().required()
  })
}

module.exports = {
  createRubricValidate: customValidate(createRubric),
  updateRubricValidate: customValidate(updateRubric),
  deleteRubricValidate: customValidate(deleteRubric),
  getRubricValidate: customValidate(getRubric),
  getLPRubricsValidate: customValidate(getLPRubrics),
  getOgzLPRubricsValidate: customValidate(getOgzLPRubrics)
}
