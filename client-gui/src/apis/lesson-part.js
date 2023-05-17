import { get, post, put, del } from './base'

const BASE = '/lesson-parts'

const createLessonPart = (lessonId, name) => post(
  `${BASE}/lesson/${lessonId}`,
  { name }
)

const deleteLessonPart = (lessonId, lessonPartId, learningActionIds, name) => del(
  `${BASE}/lesson/${lessonId}/lesson-part/${lessonPartId}`,
  { learningActionIds, name }
)

const updateLessonPart = (lessonId, lessonPartId, data) => put(
  `${BASE}/lesson/${lessonId}/lesson-part/${lessonPartId}`,
  data
)

export default {
  createLessonPart,
  deleteLessonPart,
  updateLessonPart
}
