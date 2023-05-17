const { QuestionSetKey } = require('../models')

const handleCreateKeyService = async (questionId, keyAnswer) => {
  console.log('questionId: ', questionId)
  const newKey = QuestionSetKey.create({
    questionId: questionId,
    keyAnswer: keyAnswer
  })
  return newKey
}

const handleUpdateKeyService = async (questionId, newKeyAnswer) => {
  const newKey = QuestionSetKey.findOneAndUpdate(
    {
      keyAnswer: newKeyAnswer
    },
    {
      where: {
        questionId
      }
    }
  )
  return newKey
}

const handleGetAllKeyService = async () => {
  const allKeyData = await QuestionSetKey.find()
  return allKeyData
}

const handleGetKeyByIdService = async (questionId) => {
  const key = await QuestionSetKey.findOne({ questionId })
  return key
}
module.exports = {
  handleCreateKeyService,
  handleUpdateKeyService,
  handleGetAllKeyService,
  handleGetKeyByIdService
}
