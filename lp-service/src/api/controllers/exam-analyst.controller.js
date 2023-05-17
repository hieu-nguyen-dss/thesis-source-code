const ExamAnalystService = require('../services/exam-analyst')
const getApiResponse = require('../utils/response')

const handleCreateExamAnalystController = async (req, res, next) => {
  try {
    let examId = req.body.examId
    let highGrade = req.body.highGrade
    let commonGrade = req.body.commonGrade
    let lowGrade = req.body.lowGrade
    let comments = req.body.comments

    let newCommentData = await ExamAnalystService.handleCreateCommentService(
      examId,
      highGrade,
      commonGrade,
      lowGrade,
      comments
    )

    return res.status(200).json(
      getApiResponse({
        data: newCommentData
      })
    )
  } catch (error) {
    next(error)
  }
}

const handleGetAnalystByIdController = async (req, res, next) => {
  try {
    let examId = req.query.examId
    let analystData = await ExamAnalystService.getAnalystByIdService(examId)
    return res.status(200).json(
      getApiResponse({
        data: analystData
      })
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleCreateExamAnalystController,
  handleGetAnalystByIdController
}
