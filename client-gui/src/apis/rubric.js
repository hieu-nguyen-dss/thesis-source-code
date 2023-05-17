import { get, post, put, del } from './base'

const BASE = '/rubrics'

const createRubric = (learningPathId, data) => post(`${BASE}/learning-path/${learningPathId}`, data)

const updateRubric = (rubricId, data) => put(`${BASE}/${rubricId}`, data)

const getLPRubrics = (learningPathId) => get(`${BASE}/learning-path/${learningPathId}`)

const getOgzLPRubrics = (ogzId, learningPathId) =>
  get(`${BASE}/learning-path/${learningPathId}/organization/${ogzId}`)

export default {
  createRubric,
  updateRubric,
  getLPRubrics,
  getOgzLPRubrics
}
