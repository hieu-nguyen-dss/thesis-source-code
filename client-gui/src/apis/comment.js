import { get, post, put, del } from './base'

const BASE = '/comments'

const commentLesson = (courseId, lessonId, parentId = '', content, ownerId) => post(
  `${BASE}/course/${courseId}/lesson/${lessonId}/parent/${parentId}`,
  { content, ownerId }
)

const commentRoadmap = (roadmapId, parentId = '', content, ownerId) => post(
  `${BASE}/roadmap/${roadmapId}/parent/${parentId}`,
  { content, ownerId }
)

const commentCourse = (courseId, parentId = '', content, ownerId) => post(
  `${BASE}/course/${courseId}/parent/${parentId}`,
  { content, ownerId }
)

const editComment = (commentId, content) => put(
  `${BASE}/${commentId}`,
  { content }
)

const deleteComment = (lessonId, commentId) => del(
  `${BASE}/lesson/${lessonId}/${commentId}`
)

const getComments = (commentIds) => {
  return get(
    `${BASE}${commentIds.reduce((res, cur) => (res + `&commentIds=${cur}`), '?')}`
  )
}

export default {
  commentLesson,
  editComment,
  deleteComment,
  commentRoadmap,
  commentCourse,
  getComments
}
