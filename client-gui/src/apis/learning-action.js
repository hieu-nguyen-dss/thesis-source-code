import { get, post, put, del } from './base'

const BASE = '/learning-actions'

const createLearningAction = (learningPathId, lessonId, lessonPartId, data) =>
  post(`${BASE}/${learningPathId}/${lessonId}/${lessonPartId}`, data)

const deleteLearningAction = (
  learningPathId,
  lessonId,
  lessonPartId,
  learningActionId,
  name,
  isCompleted
) =>
  del(`${BASE}/${learningPathId}/${lessonId}/${lessonPartId}/${learningActionId}`, {
    name,
    isCompleted
  })

const updateLearningAction = (learningPathId, lessonId, learningActionId, data) =>
  put(`${BASE}/${learningPathId}/${lessonId}/${learningActionId}`, data)

export default {
  createLearningAction,
  deleteLearningAction,
  updateLearningAction
}
