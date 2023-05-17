const schedule = require('node-schedule')

const { analysisRepo, adminRepo } = require('../repo')

const autoCountUser = async () => {
  await analysisRepo.insertAmountUser()
}

const autoCountLp = async () => {
  await analysisRepo.insertAmountLp()
}

const autoCreateAmdin = async () => {
  await adminRepo.createDefaultAdmin()
}

const startAuto = () => {
  autoCreateAmdin().then().catch()
  schedule.scheduleJob('analysis', '* */1 * * *', () => {
    autoCountUser().then().catch()
    autoCountLp().then().catch()
  })
}

module.exports = startAuto
