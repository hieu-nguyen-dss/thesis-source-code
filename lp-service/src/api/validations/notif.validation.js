const { Joi } = require('express-validation')

const { customValidate, joiPagination } = require('../utils/validation')

const getNotifs = {
  query: Joi.object({
    ...joiPagination
  })
}

module.exports = {
  getNotifsValidate: customValidate(getNotifs)
}
