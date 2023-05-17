const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const { lessonRepo } = require('../repo')

const getLesson = async (req, res, next) => {
  const { learningPathId, lessonId } = req.params
  const { id } = req.payload
  try {
    const [lesson, { outcomes, ownerId, public: isPublic }, editPermission] =
      await lessonRepo.getLesson(id, learningPathId, lessonId)
    lesson.yours = id === ownerId.toString() || editPermission !== null
    if (!isPublic && !lesson.yours) {
      return res.status(httpStatus.NOT_FOUND).json(
        getApiResponse({
          data: null
        })
      )
    }
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: { lesson, outcomes, ownerId }
      })
    )
  } catch (error) {
    next(error)
  }
}

const getOgzLesson = async (req, res, next) => {
  const { ogzId, learningPathId, lessonId } = req.params
  const { id } = req.payload
  try {
    const [lesson, { outcomes, ownerId, public: isPublic }, editPermission, ou] =
      await lessonRepo.getOgzLesson(ogzId, id, learningPathId, lessonId)
    lesson.yours =
      id === ownerId.toString() || editPermission !== null || (ou !== null && ou.role === 'ADMIN')
    if (!isPublic && !ou) {
      return res.status(httpStatus.NOT_FOUND).json(
        getApiResponse({
          data: null
        })
      )
    }
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: { lesson, outcomes, ownerId }
      })
    )
  } catch (error) {
    next(error)
  }
}

const createLesson = async (req, res, next) => {
  const { partId } = req.params
  const { name } = req.body
  try {
    const createdLesson = await lessonRepo.createLesson(partId, name)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdLesson }))
  } catch (error) {
    next(error)
  }
}

const deleteLesson = async (req, res, next) => {
  const { partId, lessonId } = req.params
  try {
    await lessonRepo.deleteLesson(partId, lessonId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const updateLesson = async (req, res, next) => {
  const { lessonId } = req.params
  try {
    const updatedLesson = await lessonRepo.updateLesson(lessonId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: updatedLesson }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getLesson,
  createLesson,
  deleteLesson,
  updateLesson,
  getOgzLesson
}
