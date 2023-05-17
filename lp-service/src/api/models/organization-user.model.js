const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const organizationUserSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    ogz: {
      type: ObjectId,
      ref: 'organization',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER'],
      default: 'MEMBER'
    },
    inviting: {
      type: Boolean,
      default: true
    },
    accepted: {
      type: Boolean
    }
  }
)
organizationUserSchema.indexes()
const OrganizationUser = mongoose.model('organization-user', organizationUserSchema)

module.exports = OrganizationUser
