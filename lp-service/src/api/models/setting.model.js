const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
/**
 * User Schema
 * @private
 */
const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      index: true
    },
    language: {
      type: String,
      required: true,
      default: 'en'
    }
  }
)
settingSchema.indexes()
/**
 * typedef user
 */
const Setting = mongoose.model('setting', settingSchema)

module.exports = Setting
