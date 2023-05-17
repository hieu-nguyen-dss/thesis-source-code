import { get, post, patch, del } from './base'

const handleQuestionAddApi = (content, key, subject, category, level, author) => {
  return post('/create-question', {
    content,
    key,
    subject,
    category,
    level,
    author
  })
}

const handleQuestionListApi = () => {
  return get('/list-questions')
}

const handleGetQuestionByIdApi = (id) => {
  return get(`/get-question?id=${id}`)
}

const handleDeleteQuestionApi = (questionId) => {
  return del('/delete-question', { data: { id: questionId } })
}

const handleUpdateQuestionApi = (questionId, content, key, subject, category, level) => {
  return patch('/update-question', {
    questionId,
    content,
    key,
    subject,
    category,
    level
  })
}

export {
  handleQuestionAddApi,
  handleGetQuestionByIdApi,
  handleQuestionListApi,
  handleDeleteQuestionApi,
  handleUpdateQuestionApi
}
