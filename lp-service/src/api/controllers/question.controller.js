const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const questionService = require('../services/questionService')
const { QuestionSet, QuestionSetKey } = require('../models')

const handleAddQuestionController = async (req, res, next) => {
  try {
    let content = req.body.content
    let subject = req.body.subject
    let category = req.body.category
    let level = req.body.level
    let key = req.body.key
    let author = req.body.author
    let newQuestionData = await questionService.handleAddQuestionService(
      content,
      key,
      subject,
      category,
      level,
      author
    )
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: newQuestionData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetAllQuestionController = async (req, res, next) => {
  try {
    let allQuestionData = await questionService.handleGetAllQuestionService()
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: allQuestionData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetQuestionByIdController = async (req, res, next) => {
  try {
    let questionId = req.query.id
    let questionData = await questionService.handleGetQuestionByIdService(questionId)
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: questionData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleDeleteQuestionController = async (req, res, next) => {
  try {
    await QuestionSetKey.findOneAndDelete({
      questionId: req.body.data.id
    })
    await QuestionSet.findOneAndDelete({
      _id: req.body.data.id
    })
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: {}
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleUpdateQuestionController = async (req, res, next) => {
  try {
    let questionId = req.body.questionId
    let content = req.body.content
    let key = req.body.key
    let subject = req.body.subject
    let category = req.body.category
    let level = req.body.level
    let updateQuestionData = await questionService.handleUpdateQuestionService(
      questionId,
      content,
      key,
      subject,
      category,
      level
    )
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: updateQuestionData
      })
    )
  } catch (error) {
    next()
  }
}

module.exports = {
  handleAddQuestionController,
  handleGetAllQuestionController,
  handleGetQuestionByIdController,
  handleDeleteQuestionController,
  handleUpdateQuestionController
}
