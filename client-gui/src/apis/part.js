import { get, post, put, del } from './base'

const BASE = '/parts'

const createPart = (learningPathId, name) => post(
  `${BASE}/${learningPathId}`,
  { name }
)

const deletePart = (learningPathId, partId) => del(
  `${BASE}/${learningPathId}/${partId}`
)

export default {
  createPart,
  deletePart
}
