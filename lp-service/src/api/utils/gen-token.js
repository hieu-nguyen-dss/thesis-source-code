const jwt = require('jsonwebtoken')

const genToken = (payload, secretKey, expiresIn = '10days') => {
  const token = jwt.sign(payload, secretKey, { expiresIn })
  return token
}

module.exports = genToken
