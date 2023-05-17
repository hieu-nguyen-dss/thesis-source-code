import * as rest from './base'

const login = (data) => rest.post('/admin/auth/login', data)

const signup = (data) => rest.post('/admin/auth/signup', data)

const deleteAcc = (data) => rest.del('/admin/', data)

const adminList = () => rest.get('/admin/')

const listUser = (userType) => rest.get(`/users/all?userType=${userType}`)
const deleteUser = (ids) => {
  let str = null
  ids.forEach(id => {
    if (str) {
      str = str + ',' + id
    } else {
      str = id
    }
  })
  return rest.del(`/users/delete?id=${str}`)
}

export default {
  login,
  signup,
  adminList,
  deleteAcc,
  listUser,
  deleteUser
}
