const { Exam } = require('../models')

let handleGetExamByIdService = async (id) => {
  let exam = await Exam.findById(id)
  return exam
}

let handleGetAllExams = async () => {
  const allExams = await Exam.find()
  return allExams
}

let handleCreateExamService = async (subject, category, questions, timeLimit, maxScore, file) => {
  const exam = await Exam.create({
    subject,
    category,
    questions,
    timeLimit: 90,
    maxScore: 10,
    file
  })
  return exam
}

module.exports = {
  handleGetExamByIdService,
  handleGetAllExams,
  handleCreateExamService
}
