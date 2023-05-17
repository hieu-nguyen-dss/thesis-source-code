const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const getLesson = {
  params: Joi.object({
    lessonId: Joi.string().required(),
    learningPathId: Joi.string().required()
  })
}

const getOgzLesson = {
  params: Joi.object({
    ogzId: Joi.string().required(),
    lessonId: Joi.string().required(),
    learningPathId: Joi.string().required()
  })
}

const createLesson = {
  params: Joi.object({
    partId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required()
  })
}

const updateLesson = {
  params: Joi.object({
    lessonId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    content: Joi.string(),
    preparation: Joi.string(),
    outcomes: Joi.string(),
    lessonParts: Joi.array().items(
      Joi.string()
    ).single()
  })
}

const deleteLesson = {
  params: Joi.object({
    partId: Joi.string().required(),
    lessonId: Joi.string().required()
  })
}

module.exports = {
  getLessonValidate: customValidate(getLesson),
  getOgzLessonValidate: customValidate(getOgzLesson),
  createLessonValidate: customValidate(createLesson),
  deleteLessonValidate: customValidate(deleteLesson),
  updateLessonValidate: customValidate(updateLesson)
}
