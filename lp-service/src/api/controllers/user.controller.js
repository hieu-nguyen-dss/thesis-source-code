const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')
const passwordUtils = require('../utils/password')
const genToken = require('../utils/gen-token')
const { userRepo } = require('../repo')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const {
      authConfig: { secretKey }
    } = req
    const user = await userRepo.getUserByeEmail(email)
    if (user) {
      if (user.userType === 'STUDENT')
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(getApiResponse({ data: { msg: 'User do not have permission to access' } }))
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
    const { email, password, name, userType, organization } = req.body
    console.log('organization: ', organization)
    const user = await userRepo.getUserByeEmail(email)
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).json(getApiResponse({ msg: 'Exist' }))
    } else {
      const hash = passwordUtils.genPassword(password)
      userRepo
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

const getUsers = async (req, res, next) => {
  const { userId } = req.query
  const { id } = req.payload
  try {
    const [user, lps, rms, ufr] = await userRepo.getUser(userId, id)
    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: { user, lps, rms, ufr, you: userId === id } }))
  } catch (error) {
    next(error)
  }
}

const getListUser = async (req, res, next) => {
  const { userType } = req.query
  try {
    const users = await userRepo.getListUser(userType)
    return res.status(httpStatus.OK).json(getApiResponse({ data: users }))
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  const { id } = req.query
  const ids = id.split(',')
  try {
    const users = await userRepo.deleteUser(ids)
    return res.status(httpStatus.OK).json(getApiResponse({ data: users }))
  } catch (error) {
    next(error)
  }
}

const getUsersByEmail = async (req, res, next) => {
  const { email } = req.query
  try {
    const rs = await userRepo.getUsersByEmail(email)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  signup,
  getUsers,
  getUsersByEmail,
  getListUser,
  deleteUser
}
