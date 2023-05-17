import { get, post, put, del } from './base'

const getNotifs = (page) => get(`/notifs?page=${page}`)

export default {
  getNotifs
}
