const path = require('path')

require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
})

module.exports = {
  env: process.env.NODE_ENV || 'test',
  port: process.env.PORT || 8000,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  pagination: {
    page: process.env.PAGINATION_PAGE || 1,
    records: process.env.PAGINATION_RECORD || 10
  },
  authConfig: {
    url: process.env.AUTH_CALLBACK_URL || 'http://localhost:3001/auth/v1',
    secretKey: process.env.AUTH_SECRET_KEY || 'bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3q',
    expireCode: process.env.AUTH_EXPIRE_CODE || 419
  },
  googleAuth: {
    clientId: '539858948786-ikpu6sv3on7im2g23ci71datg5t2020l.apps.googleusercontent.com',
    clientSecret: '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',
    redirectUri: 'http://localhost:8000/auth/google'
  },
  nodemailer: {
    user: process.env.MAIL_USERNAME || 'mrkienkptn@gmail.com',
    pass: process.env.MAIL_PASSWORD || 'koatrpdqqausqxga',
    clientId:
      process.env.OAUTH_CLIENTID ||
      '694408575075-u9junos4ffksiljpu9c8r3ksvqk6accq.apps.googleusercontent.com',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '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',
    refreshToken:
      process.env.OAUTH_REFRESH_TOKEN ||
      '1//04iDkf5NBTKTSCgYIARAAGAQSNwF-L9IryBbt2u-4vz8R6f42jxixWypW-m5nz074GVGYoltf2EBxytece4WtdldBCEcqQeAgE3s'
  },
  socketServer: `http://${process.env.SOCKET_HOST || 'localhost'}:${
    process.env.SOCKET_PORT || 4000
  }`,
  client: `http://${process.env.CLIENT_HOST || 'localhost'}:${process.env.CLIENT_PORT || 3000}`,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
}
