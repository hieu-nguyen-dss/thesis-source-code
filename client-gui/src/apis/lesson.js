import { get, post, put, del } from './base'

const BASE = '/lessons'

const getLesson = (learningPathId, lessonId) => get(`${BASE}/${learningPathId}/${lessonId}`)

const getOgzLesson = (ogzId, learningPathId, lessonId) =>
  get(`${BASE}/${ogzId}/${learningPathId}/${lessonId}`)

const updateLesson = (lessonId, data) => put(`${BASE}/${lessonId}`, data)

const createLesson = (partId, name) => post(`${BASE}/${partId}`, { name })

const deleteLesson = (partId, lessonId) => del(`${BASE}/${partId}/${lessonId}`)

export default {
  createLesson,
  updateLesson,
  getLesson,
  deleteLesson,
  getOgzLesson
}
