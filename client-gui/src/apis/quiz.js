import { get, post, put, del } from './base'

const BASE = '/quiz'

const getQuiz = (learningPathId, lessonId) => get(`${BASE}/${learningPathId}/${lessonId}`)

const updateQuiz = (lessonId, data) => put(`${BASE}/${lessonId}`, data)

const createQuiz = (learningPathId, lessonId, question, choices, answer, userId) => post(`${BASE}/${learningPathId}/${lessonId}`, { question, choices, answer, userId })

const deleteQuiz = (partId, lessonId) => del(`${BASE}/${partId}/${lessonId}`)

export default {
  createQuiz,
  updateQuiz,
  getQuiz,
  deleteQuiz
}
