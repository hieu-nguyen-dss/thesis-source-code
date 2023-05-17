const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const { lessonPartRepo } = require('../repo')

const createLessonPart = async (req, res, next) => {
  const { id } = req.payload
  const { lessonId } = req.params
  const { name } = req.body
  try {
    const createdPart = await lessonPartRepo.createPart(id, lessonId, name)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdPart }))
  } catch (error) {
    next(error)
  }
}

const deleteLessonPart = async (req, res, next) => {
  const { lessonId, lessonPartId } = req.params
  const { learningActionIds, name } = req.body
  const { id } = req.payload
  try {
    await lessonPartRepo.deletePart(id, lessonId, lessonPartId, learningActionIds, name)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const updateLessonPart = async (req, res, next) => {
  const { lessonPartId, lessonId } = req.params
  const { id } = req.payload
  try {
    const updatedLessonPart = await lessonPartRepo.updatePart(id, lessonId, lessonPartId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: updatedLessonPart }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createLessonPart,
  deleteLessonPart,
  updateLessonPart
}
