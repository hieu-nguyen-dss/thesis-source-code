const { Admin } = require('../models')
const passwordUtils = require('../utils/password')

const createUser = (email, hash, name, userType) => {
  const user = new Admin()
  user.email = email
  user.password = hash
  user.name = name
  user.userType = userType
  return user.save()
}

const getUserByeEmail = async (email) => {
  const user = Admin.findOne({ email })
  return user
}

const updateUser = async (userId, data) => {
  return await Admin.findByIdAndUpdate(userId, data)
}

const getAdminList = async () => {
  return await Admin.find({}, '_id name email')
}

const deleteAccount = async (id) => {
  return await Admin.findByIdAndDelete(id)
}

const createDefaultAdmin = async () => {
  const exs = await Admin.findOne({ email: 'kien.tv@gmail.com' })
  if (exs) return
  const hash = passwordUtils.genPassword('121212')
  await new Admin({ name: 'Admin', email: 'kien.tv@gmail.com', password: hash }).save()
}

module.exports = {
  createUser,
  getUserByeEmail,
  updateUser,
  getAdminList,
  deleteAccount,
  createDefaultAdmin
}
