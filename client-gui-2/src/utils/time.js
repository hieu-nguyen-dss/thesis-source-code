const remainingTime = (finishTime) => {
  if (!finishTime) return '∞'
  let remainSeconds = (new Date(finishTime) - new Date()) / 1000
  const days = Math.floor(remainSeconds / 86400)
  remainSeconds -= days * 86400
  const hours = Math.floor(remainSeconds / 3600)
  remainSeconds -= hours * 3600
  const minutes = Math.floor(remainSeconds / 60)
  // return {
  //   days, hours, minutes
  // }
  return `${days > 0 ? `${days} days` : ''} ${hours > 0 ? `${hours} hours` : ''} ${
    minutes > 0 ? `${minutes} minutes` : 'expired'
  }`
}

const duration = (startDate, finishDate) => {
  return Math.ceil((new Date(finishDate) - new Date(startDate)) / 1000 / 86400)
}

export { remainingTime, duration }
