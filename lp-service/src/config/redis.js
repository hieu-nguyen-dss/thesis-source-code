const { createClient } = require('redis')

const { redis } = require('./vars')

const client = createClient({
  url: `redis://${redis.host}:${redis.port}`
})

const get = async (key) => {
  const value = await client.get(key)
  if (!value) return null
  return JSON.parse(value)
}

const set = (key, value, extTime) => {
  client.set(key, JSON.stringify(value), { EX: extTime })
}

const del = (key) => {
  client.del(key)
}

const connect = async () => {
  try {
    await client.connect()
    console.log(`Connected redis://${redis.host}:${redis.port}`)
  } catch (error) {
    console.log('Cannot connect to redis')
  }
}

module.exports = {
  get,
  set,
  del,
  connect
}
