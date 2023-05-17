const mongoose = require('mongoose')

const examAnalystSchema = new mongoose.Schema({
  examId: {
    type: String
  },
  highGrade: {
    type: Number
  },
  commonGrade: {
    type: Number
  },
  lowGrade: {
    type: Number
  },
  comments: {
    type: String
  }
})

const ExamAnalyst = mongoose.model('exam-analyst', examAnalystSchema)

module.exports = ExamAnalyst
