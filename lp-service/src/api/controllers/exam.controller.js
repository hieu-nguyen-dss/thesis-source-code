const examService = require('../services/examService')
const getApiResponse = require('../utils/response')

const handleGetExamByIdController = async (req, res, next) => {
  try {
    let examId = req.query.id
    let examData = await examService.handleGetExamByIdService(examId)
    return res.status(200).json(
      getApiResponse({
        data: examData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetAllExamsController = async (req, res, next) => {
  try {
    let allExamData = await examService.handleGetAllExams()
    return res.status(200).json(
      getApiResponse({
        data: allExamData
      })
    )
  } catch (error) {
    next(error)
  }
}
const handleCreateExamController = async (req, res, next) => {
  try {
    let subject = req.body.subject
    let category = req.body.category
    let questions = req.body.questions
    let timeLimit = req.body.timeLimit
    let maxScore = req.body.maxScore
    let file = req.file
    let newExamData = await examService.handleCreateExamService(
      subject,
      category,
      questions,
      timeLimit,
      maxScore,
      file
    )
    return res.status(200).json(
      getApiResponse({
        data: newExamData
      })
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleGetExamByIdController,
  handleGetAllExamsController,
  handleCreateExamController
}
