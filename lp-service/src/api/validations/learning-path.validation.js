const { Joi } = require('express-validation')

const { customValidate, joiPagination } = require('../utils/validation')

const getLPDetail = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  })
}

const getOgzLPDetail = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    ogzId: Joi.string().required()
  })
}

const searchLearningPath = {
  query: Joi.object({
    name: Joi.string().allow(''),
    category: Joi.string().allow(''),
    star: Joi.string().allow(''),
    type: Joi.string().allow(''),
    ...joiPagination
  })
}

const createLearningPath = {
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
    learningPathId: Joi.string().required()
  })
}

const updateLearningPath = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    outcomes: Joi.string(),
    public: Joi.boolean(),
    allowClone: Joi.boolean(),
    category: Joi.string()
  })
}

const cloneLearningPath = {
  params: Joi.object({
    learningPathId: Joi.string().required(),
    name: Joi.string()
  })
}

const editEditor = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  }),
  body: Joi.object({
    userId: Joi.string().required()
  })
}

const getLPEditors = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  })
}

const starLP = {
  params: Joi.object({
    learningPathId: Joi.string().required()
  })
}

module.exports = {
  getLPDetailValidate: customValidate(getLPDetail),
  getOgzLPDetailValidate: customValidate(getOgzLPDetail),
  searchLPValidate: customValidate(searchLearningPath),
  createLPValidate: customValidate(createLearningPath),
  deleteLPValidate: customValidate(deleteLearningPath),
  updateLPValidate: customValidate(updateLearningPath),
  cloneLPValidate: customValidate(cloneLearningPath),
  editEditorValidate: customValidate(editEditor),
  getLPEditorsValidate: customValidate(getLPEditors),
  starLPValidation: customValidate(starLP)
}
