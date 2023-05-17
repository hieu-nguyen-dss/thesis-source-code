const { LessonPart, LearningAction, LessonUpdate, Lesson, LearningPath } = require('../models')
const {
  LESSON_UPDATE: { ACTION_TYPE }
} = require('../constants')

const createAction = async (dt) => {
  const { user, learningPathId, lessonId, lessonPartId, data } = dt
  const newAction = new LearningAction(data)
  const createdAction = await newAction.save()
  const addActionUpdate = new LessonUpdate({
    user,
    actionType: ACTION_TYPE.ADD_LEARNING_ACTION,
    subject: createdAction._id
  })
  const updateHistory = await addActionUpdate.save()
  await Promise.all([
    LearningPath.findOneAndUpdate(
      { id: learningPathId },
      {
        $inc: { totalActions: 1 }
      }
    ),
    LessonPart.findByIdAndUpdate(lessonPartId, {
      $addToSet: { learningActions: createdAction._id }
    }),
    Lesson.findByIdAndUpdate(lessonId, {
      $addToSet: { updateHistories: updateHistory._id },
      $inc: { totalActions: 1 }
    })
  ])
  return { createdAction, updateHistory }
}

const deleteAction = async (data) => {
  const { user, learningPathId, lessonId, lessonPartId, learningActionId, name, isCompleted } = data

  const delAction = LearningAction.findByIdAndDelete(learningActionId)
  const removeFromPart = LessonPart.findByIdAndUpdate(lessonPartId, {
    $pull: { learningActions: learningActionId }
  })
  const delActionUpdate = new LessonUpdate({
    user,
    actionType: ACTION_TYPE.REMOVE_LEARNING_ACTION,
    subject: name
  })
  const updateHistory = await delActionUpdate.save()
  let updateLessonHitories = Lesson.findByIdAndUpdate(lessonId, {
    $addToSet: { updateHistories: updateHistory._id },
    $inc: { totalActions: -1 }
  })
  let minusTotalActions = LearningPath.findOneAndUpdate(
    { id: learningPathId },
    {
      $inc: { totalActions: -1 }
    }
  )
  if (isCompleted) {
    minusTotalActions = LearningPath.findOneAndUpdate(
      { id: learningPathId },
      {
        $inc: { totalActions: -1, completedActions: -1 }
      }
    )
    updateLessonHitories = Lesson.findByIdAndUpdate(lessonId, {
      $addToSet: { updateHistories: updateHistory._id },
      $inc: { totalActions: -1, completedActions: -1 }
    })
  }
  await Promise.all([delAction, removeFromPart, updateLessonHitories, minusTotalActions])

  return updateHistory
}

const updateAction = async (dt) => {
  const { learningPathId, lessonId, learningActionId, data } = dt
  if (data.completed) {
    return await Promise.all([
      LearningPath.findOneAndUpdate(
        { id: learningPathId },
        {
          $inc: { completedActions: 1 }
        }
      ),
      Lesson.findByIdAndUpdate(lessonId, {
        $inc: { completedActions: 1 }
      }),
      LearningAction.findByIdAndUpdate(learningActionId, data)
    ])
  }
  if (data.completed === false) {
    return await Promise.all([
      LearningPath.findOneAndUpdate(
        { id: learningPathId },
        {
          $inc: { completedActions: -1 }
        }
      ),
      Lesson.findByIdAndUpdate(lessonId, {
        $inc: { completedActions: -1 }
      }),
      LearningAction.findByIdAndUpdate(learningActionId, data)
    ])
  }
  const updatedAction = await LearningAction.findByIdAndUpdate(learningActionId, data)
  return updatedAction
}

module.exports = {
  createAction,
  deleteAction,
  updateAction
}
