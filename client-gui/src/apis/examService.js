import { get, post } from './base'

const handleGetExamByIdApi = (id) => {
  return get(`/get-exam?id=${id}`)
}

const handleGetAllExamApi = () => {
  return get('/list-exams')
}

const handleCreateExamApi = (subject, category, questions, timeLimit, maxScore, file) => {
  return post('/create-exam', {
    subject,
    category,
    questions,
    timeLimit,
    maxScore,
    file
  })
}

export { handleGetExamByIdApi, handleGetAllExamApi, handleCreateExamApi }
