const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const editPermissionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: 'user'
    },
    learningPathId: {
      type: String,
      required: true
    }
  }
)
editPermissionSchema.indexes()
const EditPermission = mongoose.model('edit-permission', editPermissionSchema)

module.exports = EditPermission
