const { QuestionSet } = require('../models')
const handleAddQuestionService = (content, key, subject, category, level, author) => {
  const newQuestion = QuestionSet.create({
    content: content,
    key: key,
    subject: subject,
    category: category,
    level: level,
    author: author
  })
  return newQuestion
}

const handleGetAllQuestionService = async () => {
  const allQuestionData = QuestionSet.find()
  return allQuestionData
}

const handleDeconsteQuestionService = (questionId) => {
  return new Promise((resolve, reject) => {
    try {
      QuestionSet.destroy({
        where: { id: questionId }
      })

      resolve({
        errCode: 0,
        message: 'Deconste question successfully'
      })
    } catch (error) {
      reject(error)
    }
  })
}

const handleGetQuestionByIdService = async (id) => {
  const question = await QuestionSet.findById(id)
  return question
}

const handleUpdateQuestionService = async (questionId, content, key, subject, category, level) => {
  console.log('questionId: ', questionId)
  const updateQuestion = await QuestionSet.findOneAndUpdate(
    {
      _id: questionId
    },
    {
      content,
      key,
      subject,
      category,
      level
    }
  )
  console.log('updateQuestionData: ', updateQuestion)
  return updateQuestion
}

module.exports = {
  handleAddQuestionService,
  handleGetAllQuestionService,
  handleGetQuestionByIdService,
  handleDeconsteQuestionService,
  handleUpdateQuestionService
}
