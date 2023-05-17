import * as rest from './base'

const login = (data) => rest.post('/users/login', data)

const signup = (data) => rest.post('/users/signup', data)

const getUserDetail = (userId) => rest.get('/users/detail?userId=' + userId)

const getUsersByEmail = (email) => rest.get('/users/result?email=' + email)

export default {
  login,
  signup,
  getUserDetail,
  getUsersByEmail
}
