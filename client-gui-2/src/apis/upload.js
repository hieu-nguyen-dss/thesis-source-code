import { get, post, put, del } from './base'

const BASE = '/uploads'

const uploadFile = (lessonId, data) => post(
  `${BASE}/${lessonId}`,
  data
)

const deleteFile = (lessonId, name, type) => del(
  `${BASE}/${lessonId}`,
  { name, type }
)

const uploadFileRoadmap = (roadmapId, roadmapStepId, data) => post(
  `${BASE}/roadmaps/${roadmapId}/steps/${roadmapStepId}`,
  data
)

const changeAvatar = (userId, data) => put(
  `${BASE}/profile/avatar`,
  data
)

const deleteFileRoadmap = (roadmapId, roadmapStepId, name, type) => del(
  `${BASE}/roadmaps/${roadmapId}/steps/${roadmapStepId}`,
  { name, type }
)

export default {
  uploadFile,
  deleteFile,
  changeAvatar,
  uploadFileRoadmap,
  deleteFileRoadmap
}
