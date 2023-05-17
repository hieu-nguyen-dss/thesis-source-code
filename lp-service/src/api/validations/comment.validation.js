const { Joi } = require('express-validation')

const { customValidate } = require('../utils/validation')

const commentLesson = {
  params: Joi.object({
    courseId: Joi.string().required(),
    lessonId: Joi.string().required(),
    parentId: Joi.string()
  }),
  body: Joi.object({
    content: Joi.string().required(),
    ownerId: Joi.string().required()
  })
}

const commentCourse = {
  params: Joi.object({
    courseId: Joi.string().required(),
    parentId: Joi.string()
  }),
  body: Joi.object({
    content: Joi.string().required(),
    ownerId: Joi.string().required()
  })
}

const commentRoadmap = {
  params: Joi.object({
    roadmapId: Joi.string().required(),
    parentId: Joi.string()
  }),
  body: Joi.object({
    content: Joi.string().required(),
    ownerId: Joi.string().required()
  })
}

const editComment = {
  params: Joi.object({
    commentId: Joi.string().required()
  }),
  body: Joi.object({
    content: Joi.string().required()
  })
}

const deleteComment = {
  params: Joi.object({
    lessonId: Joi.string().required(),
    commentId: Joi.string().required()
  })
}

const getComments = {
  query: Joi.object({
    commentIds: Joi.array().items(
      Joi.string().required()
    ).single()
  })
}

module.exports = {
  commentLessonValidate: customValidate(commentLesson),
  commentRoadmapValidate: customValidate(commentRoadmap),
  commentCourseValidate: customValidate(commentCourse),
  editCommentValidate: customValidate(editComment),
  deleteCommentValidate: customValidate(deleteComment),
  getCommentsValidate: customValidate(getComments)
}
