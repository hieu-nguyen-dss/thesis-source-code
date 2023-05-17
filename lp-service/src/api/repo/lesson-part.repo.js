const { ObjectId } = require('mongoose').Types

const { LessonPart, Lesson, LearningAction, LessonUpdate } = require('../models')
const { LESSON_UPDATE: { ACTION_TYPE } } = require('../constants')

const createPart = async (user, lessonId, name) => {
  const newPart = new LessonPart({ name })
  const createdPart = await newPart.save()
  const addPartUpdate = new LessonUpdate({
    user,
    actionType: ACTION_TYPE.ADD_GROUP_ACTION,
    subject: createdPart._id
  })
  const updateHistory = await addPartUpdate.save()
  await Lesson.findByIdAndUpdate(lessonId, {
    $addToSet: { lessonParts: createdPart._id, updateHistories: updateHistory._id }
  })
  return { createdPart, updateHistory }
}

const deletePart = async (user, lessonId, lessonPartId, learningActionIds, name) => {
  const deletePartUpdate = new LessonUpdate({
    user,
    actionType: ACTION_TYPE.REMOVE_GROUP_ACTION,
    subject: name
  })
  const updateHistory = await deletePartUpdate.save()
  const deletePartFromLessonId = Lesson.findByIdAndUpdate(lessonId, {
    $pull: { lessonParts: lessonPartId },
    $addToSet: { updateHistories: updateHistory._id }
  })
  const deleteLessonPart = LessonPart.findByIdAndDelete(lessonPartId)
  const deleteLearningActions = LearningAction.deleteMany({ _id: { $in: learningActionIds } })
  await Promise.all([deleteLessonPart, deletePartFromLessonId, deleteLearningActions])
  return { updateHistory }
}

const updatePart = async (user, lessonId, lessonPartId, data) => {
  if (data.name) {
    const updateHistoryId = new ObjectId()
    await Lesson.findByIdAndUpdate(lessonId, {
      $addToSet: { updateHistories: updateHistoryId }
    })
    const updatedLessonPart = await LessonPart.findByIdAndUpdate(lessonPartId, data)
    const renamePartUpdate = new LessonUpdate({
      user,
      subject: lessonPartId,
      actionType: ACTION_TYPE.RENAME_GROUP_ACTION,
      beforeValue: updatedLessonPart.name,
      afterValue: data.name,
      _id: updateHistoryId
    })
    const updateHistory = await renamePartUpdate.save()
    return { updatedLessonPart, updateHistory }
  } else if (data.learningActions) {
    const updateHistoryId = new ObjectId()
    await Lesson.findByIdAndUpdate(lessonId, {
      $addToSet: { updateHistories: updateHistoryId }
    })
    const updatedLessonPart = await LessonPart.findByIdAndUpdate(lessonPartId, data)
    const moveLAUpdate = new LessonUpdate({
      user,
      subject: lessonPartId,
      actionType: ACTION_TYPE.MOVE_LEARNING_ACTION,
      _id: updateHistoryId
    })
    const updateHistory = await moveLAUpdate.save()
    return { updatedLessonPart, updateHistory }
  }
}

module.exports = {
  createPart,
  deletePart,
  updatePart
}
