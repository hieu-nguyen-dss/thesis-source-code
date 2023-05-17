import { get, post, put, del } from './base'

const BASE = '/organizations'

const createOgz = (data) => post(BASE, data)

const getMyOgzs = () => get(BASE)

const updateOgz = (ogzId, data) => put(`${BASE}/${ogzId}`, data)

const createLp = (ogzId, data) => post(`${BASE}/${ogzId}`, data)

const deleteLp = (ogzId, learningPathId) => del(`${BASE}/${ogzId}/learning-path/${learningPathId}`)

const deleteOgz = (ogzId) => del(`${BASE}/${ogzId}`)

const getOgzDetail = (ogzId) => get(`${BASE}/${ogzId}`)

const addMember = (ogzId, user) => post(`${BASE}/${ogzId}/members`, user)

const removeMember = (ogzId, user) => del(`${BASE}/${ogzId}/members`, { userId: user })

const getMembers = (ogzId) => get(`${BASE}/${ogzId}/members`)

const editRole = (ogzId, userId, role) => put(`${BASE}/${ogzId}/members/role`, { userId, role })

export default {
  createOgz,
  updateOgz,
  deleteOgz,
  getOgzDetail,
  createLp,
  deleteLp,
  getMyOgzs,
  addMember,
  removeMember,
  getMembers,
  editRole
}
