import * as rest from './base'

const getStudent = () => rest.get('/students')

export default {
  getStudent
}
