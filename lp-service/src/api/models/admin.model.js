const mongoose = require('mongoose')

/**
 * User Schema
 * @private
 */
const adminSchema = new mongoose.Schema(
  {
    avatar: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
      sparse: true
    },
    password: {
      type: String,
      required: true
    }
  }
)
adminSchema.indexes()
/**
 * typedef user
 */
const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin
