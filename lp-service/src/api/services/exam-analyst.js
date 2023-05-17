const { ExamAnalyst } = require('../models')
let handleCreateCommentService = async (examId, highGrade, commonGrade, lowGrade, comments) => {
  const newComment = ExamAnalyst.create({
    examId,
    highGrade,
    commonGrade,
    lowGrade,
    comments
  })
  return newComment
}

let getAnalystByIdService = async (examId) => {
  console.log('examId: ', examId)
  const analyst = ExamAnalyst.findOne({
    examId: examId
  })
  return analyst
}

module.exports = {
  handleCreateCommentService,
  getAnalystByIdService
}
