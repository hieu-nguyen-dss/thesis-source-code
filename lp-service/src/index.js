// eslint-disable-next-line no-global-assign
Promise = require('bluebird')
const { port, env } = require('./config/vars')
const logger = require('./config/logger')
const app = require('./config/express')
const mongoose = require('./config/mongoose')
const { connect } = require('./config/redis')
const { startAuto } = require('./api/auto')
mongoose.connect() // ensure connected
connect().then().catch(error => console.log(error))
// const {
//     LearningPath,
//   } = require('./api/models')

// var CronJob = require('cron').CronJob;
// var job = new CronJob(
//   '0 */1 * * * *',
//   async () => {
//     const time = await LearningPath.find()
//     // const [time, _2] = await sequelize.query(
//     //   "select course_id, start_date, end_date, status from course",
//     // );
//     time.map( async (e) => {
//       const start = convertUTCDateToLocalDate(e.start_date);
//       const end = convertUTCDateToLocalDate(e.end_date);
//       const now = convertUTCDateToLocalDate(new Date())
//       const beforeStatus = e.status
//       let status = '';
//       if ((start > now && end > now) == true) {
//         status = 'Getting Started'
//       }
//       if ((start < now && end > now) == true) {
//         status = 'Studying'
//       }
//       if ((start < now && end < now) == true) {
//         status = 'Finished'
//       }

//       if (status !== beforeStatus) {
//         try {
//         const filter = { id: e.id};
//         const update = { status: status };     
//         await LearningPath.findOneAndUpdate(filter, update)
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     })
//   },
//   null,
//   true,
// );
// job.start();
// listen to requests
app.listen(port, () => logger.info(`[Server] started on port ${port} (${env})`))

/**
 * Exports express
 * @public
 */
startAuto()
module.exports = app
