import { get, post, patch } from './base'

const handleAddKeyApi = (questionId, keyAnswer) => {
  return post('/create-key', { questionId, keyAnswer })
}

const handleUpdateKeyApi = (questionId, key) => {
  return patch('/update-question-key', { questionId, key })
}
const handleKeyListApi = () => {
  return get('/list-keys')
}

const handleGetKeyByIdApi = (questionId) => {
  return get(`/get-key-by-id?questionId=${questionId}`)
}
export { handleAddKeyApi, handleUpdateKeyApi, handleKeyListApi, handleGetKeyByIdApi }
