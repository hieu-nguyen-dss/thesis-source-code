const { Part, LearningPath } = require('../models')

const createPart = async (lpId, name) => {
  const newPart = new Part({ name })
  const createdPart = await newPart.save()
  await LearningPath.findOneAndUpdate(
    { id: lpId },
    {
      $addToSet: { parts: createdPart.id }
    },
    { new: true }
  )
  return createdPart
}

const deletePart = async (lpId, partId) => {
  const removeFromLP = LearningPath.findOneAndUpdate(
    { id: lpId },
    {
      $pull: { parts: partId }
    }
  )
  const deletePart = Part.findOneAndDelete({ id: lpId })
  await Promise.all([removeFromLP, deletePart])
}

module.exports = {
  createPart,
  deletePart
}
