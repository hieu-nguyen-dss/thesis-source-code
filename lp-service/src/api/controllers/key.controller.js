const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const keyService = require('../services/keyService')
const handleCreateKeyController = async (req, res, next) => {
  try {
    let questionId = req.body.questionId
    let keyAnswer = req.body.keyAnswer

    let newKeyData = await keyService.handleCreateKeyService(questionId, keyAnswer)

    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: newKeyData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleUpdateKeyController = async (req, res, next) => {
  try {
    let questionId = req.body.questionId
    let keyAnswer = req.body.keyAnswer

    let newKeyData = await keyService.handleUpdateKeyService(questionId, keyAnswer)

    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: newKeyData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetAllKeyController = async (req, res, next) => {
  try {
    let allKeyData = await keyService.handleGetAllKeyService()
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: allKeyData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetKeyByIdController = async (req, res, next) => {
  try {
    let questionId = req.query.questionId
    let keyData = await keyService.handleGetKeyByIdService(questionId)
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: keyData
      })
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleCreateKeyController,
  handleUpdateKeyController,
  handleGetAllKeyController,
  handleGetKeyByIdController
}
