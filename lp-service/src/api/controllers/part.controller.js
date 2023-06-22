const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const { partRepo } = require('../repo')

const createPart = async (req, res, next) => {
  const { learningPathId } = req.params
  const { name } = req.body
  try {
    const createdPart = await partRepo.createPart(learningPathId, name)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdPart }))
  } catch (error) {
    next(error)
  }
}

const deletePart = async (req, res, next) => {
  const { learningPathId, partId } = req.params
  try {
    await partRepo.deletePart(learningPathId, partId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPart,
  deletePart
}
