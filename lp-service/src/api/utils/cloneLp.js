const { ObjectId } = require('mongoose').Types

const cloneLp = (obj) => {
  const { parts } = obj

  const newPart = {}
  const newLesson = {}
  const newLessonPart = {}
  const newLearningAction = {}

  for (const part of parts) {
    const newPartId = ObjectId()
    newPart[part._id] = { _id: newPartId, name: part.name, lessons: [] }

    for (const lesson of part.lessons) {
      const newLessonId = ObjectId()
      newPart[part._id].lessons.push(newLessonId)
      const { lessonParts, __v, id, updateHistories, comments, _id, ...rest } = lesson
      newLesson[lesson._id] = { _id: newLessonId, ...rest, lessonParts: [] }

      for (const lessonPart of lesson.lessonParts) {
        const newLessonPartId = ObjectId()
        const { __v, ...rest } = lessonPart
        newLesson[lesson._id].lessonParts.push(newLessonPartId)
        newLessonPart[lessonPart._id] = { ...rest, learningActions: [], _id: newLessonPartId }

        for (const learningAction of lessonPart.learningActions) {
          const newLearningActionId = ObjectId()
          const { __v, ...rest } = learningAction
          newLessonPart[lessonPart._id].learningActions.push(newLearningActionId)
          newLearningAction[learningAction._id] = { ...rest, _id: newLearningActionId }
        }
      }
    }
  }
  delete obj.__v
  return {
    clonedLp: { ...obj, _id: ObjectId(), parts: Object.entries(newPart).map(([id, value]) => value._id) },
    clonedParts: Object.entries(newPart).map(([id, value]) => value),
    clonedLessons: Object.entries(newLesson).map(([id, value]) => value),
    clonedLessonParts: Object.entries(newLessonPart).map(([id, value]) => value),
    clonedLearningActions: Object.entries(newLearningAction).map(([id, value]) => value)
  }
}

module.exports = cloneLp
