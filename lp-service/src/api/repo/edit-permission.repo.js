const { EditPermission } = require('../models')

const createEditPermission = async (learningPathId, userId) => {
  const permission = new EditPermission({
    learningPathId,
    userId
  })
  return await permission.save()
}

const deleteEditPermission = async (learningPathId, userId) => {
  await EditPermission.findOneAndDelete({ learningPathId, userId })
}

module.exports = {
  createEditPermission,
  deleteEditPermission
}
