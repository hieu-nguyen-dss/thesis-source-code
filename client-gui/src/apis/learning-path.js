import { saveAs } from 'file-saver'

import { get, post, put, del } from './base'
import vars from '../config/vars'

const BASE = '/learning-paths'

const getMyLPs = () => get('/learning-paths')

const getLPDetail = (id) => get(`${BASE}/${id}`)

const getOgzLPDetail = (id, ogzId) => get(`${BASE}/${id}/organization/${ogzId}`)

const createLP = (data) => post(BASE, data)

const createOgzLP = (data) => post(`/organizations/${BASE}`, data)

const editLP = (id, data) => put(`${BASE}/${id}`, data)

const searchLP = (query) => {
  const url = Object.entries(query).reduce(
    (res, [name, value]) => res + `${name}=${value}&`,
    `${BASE}/results?`
  )
  return get(url)
}

const addEditor = (learningPathId, userId) => post(`${BASE}/${learningPathId}/editors`, { userId })

const removeEditor = (learningPathId, userId) =>
  del(`${BASE}/${learningPathId}/editors`, { userId })

const getEditors = (learningPathId) => get(`${BASE}/${learningPathId}/editors`)

const cloneLp = (learningPathId) => post(`${BASE}/${learningPathId}`)

const starLP = (learningPathId) => post(`${BASE}/${learningPathId}/stars`)

const unStarLP = (learningPathId) => del(`${BASE}/${learningPathId}/stars`)

const exportLP = (learningPathId, lpName) => {
  saveAs(`${vars.server}${BASE}/${learningPathId}/export`, `${lpName}.zip`)
}

const deleteLP = (learningPathId) => del(`${BASE}/${learningPathId}`)

const addStudentToCourse = (learningPathId, body) => post(`${BASE}/${learningPathId}/enroll`, body)
const getStudentInCourse = (learningPathId, name) =>
  get(`${BASE}/${learningPathId}/enroll?name=${name}`)
const deleteStudentInCourse = (learningPathId, body) =>
  del(`${BASE}/${learningPathId}/enroll`, body)

const quizResult = (learningPathId, quizId) => get(`${BASE}/${learningPathId}/quiz/${quizId}`)

export default {
  createLP,
  createOgzLP,
  editLP,
  getMyLPs,
  getLPDetail,
  searchLP,
  addEditor,
  removeEditor,
  getEditors,
  cloneLp,
  starLP,
  unStarLP,
  exportLP,
  deleteLP,
  getOgzLPDetail,
  addStudentToCourse,
  getStudentInCourse,
  deleteStudentInCourse,
  quizResult
}
