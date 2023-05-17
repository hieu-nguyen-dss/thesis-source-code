const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')

const verifyToken = async (req, res, next) => {
  const {
    authConfig: { secretKey, expireCode }
  } = req
  console.log(secretKey)
  try {
    const { token } = req.query

    // console.log('[verify-token] accessToken', accessToken)

    const payload = jwt.verify(token, secretKey)
    // console.log('[verify-token] payload', payload)

    req.payload = payload

    // console.log('[verify-token] payload', req.payload)

    next()
  } catch (error) {
    // console.log('[verify-token] error', error)

    if (error && error.name === 'TokenExpiredError') {
      return res.status(expireCode).json({ msg: 'Token expired' })
    }

    return res.status(httpStatus.UNAUTHORIZED).json(
      getApiResponse({
        ec: 1,
        msg: error.message
      })
    )
  }
}

module.exports = verifyToken
