const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const passwordUtils = require('../utils/password')
const genToken = require('../utils/gen-token')
const { adminRepo } = require('../repo')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const {
      authConfig: { secretKey }
    } = req
    const user = await adminRepo.getUserByeEmail(email)
    if (user) {
      const matchPassword = passwordUtils.comparePassword(password, user.password)
      if (matchPassword) {
        const payload = {
          id: user._id,
          userType: user.userType
        }
        const accessToken = genToken(payload, secretKey)
        return res.status(httpStatus.OK).json(getApiResponse({ data: { user, accessToken } }))
      } else {
        return res
          .status(httpStatus.NOT_FOUND)
          .json(getApiResponse({ msg: 'Password is not match' }))
      }
    } else {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse({ data: { user: 'Email is not exist' } }))
    }
  } catch (error) {
    next(error)
  }
}

const signup = async (req, res, next) => {
  try {
    const {
      authConfig: { secretKey }
    } = req
    const { email, password, name, userType } = req.body
    const user = await adminRepo.getUserByeEmail(email)
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).json(getApiResponse({ msg: 'Exist' }))
    } else {
      const hash = passwordUtils.genPassword(password)
      adminRepo
        .createUser(email, hash, name, userType)
        .then((newUser) => {
          const payload = {
            id: newUser._id,
            userType
          }
          const accessToken = genToken(payload, secretKey)
          return res
            .status(httpStatus.OK)
            .json(getApiResponse({ data: { user: newUser, accessToken } }))
        })
        .catch((error) => {
          console.log(error)
          return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: error }))
        })
    }
  } catch (error) {
    next(error)
  }
}

const getAdminList = async (req, res, next) => {
  try {
    const rs = await adminRepo.getAdminList()
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    if (req.body.email === 'kien.tv@gmail.com') {
      return res
        .status(httpStatus.NOT_ACCEPTABLE)
        .json(getApiResponse({ msg: 'Cannot delete this account' }))
    }
    const rs = await adminRepo.deleteAccount(req.body.id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  signup,
  getAdminList,
  deleteAccount
}
