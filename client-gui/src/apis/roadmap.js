import { get, put, post, del } from './base'

const BASE = '/roadmaps'
const createRoadmap = (data) => post(BASE, data)
const getRoadmapDetail = (roadmapId) => get(`${BASE}/${roadmapId}`)
const getMyRoadmaps = () => get(BASE)
const createStep = (roadmapId, data) => post(`${BASE}/${roadmapId}`, data)
const updateStep = (roadmapId, stepId, data) => put(`${BASE}/${roadmapId}/steps/${stepId}`, data)
const followRoadmap = (roadmapId, ownerId) => post(`${BASE}/${roadmapId}/followers`, { ownerId })
const unfollowRoadmap = (roadmapId) => del(`${BASE}/${roadmapId}/followers`)
const starRoadmap = (roadmapId) => post(`${BASE}/${roadmapId}/stars`)
const unStarRoadmap = (roadmapId) => del(`${BASE}/${roadmapId}/stars`)

export default {
  createRoadmap,
  getRoadmapDetail,
  getMyRoadmaps,
  createStep,
  updateStep,
  followRoadmap,
  unfollowRoadmap,
  starRoadmap,
  unStarRoadmap
}
