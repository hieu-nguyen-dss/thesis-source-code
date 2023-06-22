const { User } = require('../models')
const getApiResponse = require('../utils/response')
const httpStatus = require('http-status')

const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({
      userType: 'STUDENT'
    })

    return res.status(httpStatus.OK).json(getApiResponse({ data: students }))
  } catch (error) {
    next(error)
  }
}

module.exports = { getStudents }
