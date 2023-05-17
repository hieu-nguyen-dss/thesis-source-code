import { get, post, put, del } from './base'

const BASE = '/admin/analysis'

const getUserAnalysis = () => get(`${BASE}/users`)

const getDashboardStatistics = () => get(`${BASE}/top-statistics`)

export default {
  getUserAnalysis,
  getDashboardStatistics
}
