const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const { learningActionRepo } = require('../repo')

const createAction = async (req, res, next) => {
  const { id } = req.payload
  const dt = { ...req.params, data: req.body, user: id }
  try {
    const rs = await learningActionRepo.createAction(dt)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteAction = async (req, res, next) => {
  const { id } = req.payload
  const dt = { ...req.params, ...req.body, user: id }
  try {
    const createdAction = await learningActionRepo.deleteAction(dt)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdAction }))
  } catch (error) {
    next(error)
  }
}

const updateAction = async (req, res, next) => {
  const { id } = req.payload
  const dt = { ...req.params, data: req.body, user: id }
  try {
    const updatedAction = await learningActionRepo.updateAction(dt)
    return res.status(httpStatus.OK).json(getApiResponse({ data: updatedAction }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createAction,
  deleteAction,
  updateAction
}
