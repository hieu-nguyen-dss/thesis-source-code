const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const { commentRepo, notifRepo } = require('../repo')

const commentLesson = async (req, res, next) => {
  const { id } = req.payload
  const { courseId, lessonId } = req.params
  const { content, ownerId } = req.body
  try {
    if (req.params.parentId) {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtLessonNotif(id, courseId, lessonId, ownerId),
        commentRepo.commentLesson(lessonId, id, content, req.params.parentId)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    } else {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtLessonNotif(id, courseId, lessonId, ownerId),
        commentRepo.commentLesson(lessonId, id, content)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    }
  } catch (error) {
    next(error)
  }
}

const commentCourse = async (req, res, next) => {
  const { id } = req.payload
  const { courseId } = req.params
  const { content, ownerId } = req.body
  try {
    if (req.params.parentId) {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtLpNotif(id, courseId, ownerId),
        commentRepo.commentCourse(courseId, id, content, req.params.parentId)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    } else {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtLpNotif(id, courseId, ownerId),
        commentRepo.commentCourse(courseId, id, content)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    }
  } catch (error) {
    next(error)
  }
}

const commentRoadmap = async (req, res, next) => {
  const { id } = req.payload
  const { roadmapId } = req.params
  const { content, ownerId } = req.body
  try {
    if (req.params.parentId) {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtRoadmapNotif(id, roadmapId, ownerId),
        commentRepo.commentRoadmap(roadmapId, id, content, req.params.parentId)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    } else {
      const [, createdComment] = await Promise.all([
        notifRepo.cmtRoadmapNotif(id, roadmapId, ownerId),
        commentRepo.commentRoadmap(roadmapId, id, content)
      ])
      return res.status(httpStatus.OK).json(getApiResponse({ data: createdComment }))
    }
  } catch (error) {
    next(error)
  }
}

const editComment = async (req, res, next) => {
  const { commentId } = req.params
  const { content } = req.body
  try {
    const editedComment = await commentRepo.editComment(commentId, content)
    return res.status(httpStatus.OK).json(getApiResponse({ data: editedComment }))
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  const { lessonId, commentId } = req.params
  try {
    await commentRepo.deleteComment(lessonId, commentId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  const { commentIds } = req.query
  try {
    const comments = await commentRepo.getComments(commentIds)
    return res.status(httpStatus.OK).json(getApiResponse({ data: comments }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  commentLesson,
  commentRoadmap,
  commentCourse,
  editComment,
  deleteComment,
  getComments
}
