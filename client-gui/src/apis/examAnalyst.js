import { get, post } from './base'

const handleCreateAnalystApi = (examId, highGrade, commonGrade, lowGrade, comments) => {
  return post('/create-exam-analyst', {
    examId,
    highGrade,
    commonGrade,
    lowGrade,
    comments
  })
}

const hanldeGetAnalystByIdApi = (examId) => {
  return get(`/get-analyst-by-id?examId=${examId}`)
}

export { handleCreateAnalystApi, hanldeGetAnalystByIdApi }
