const remainingTime = (finishTime, t) => {
  if (!finishTime) return '∞'
  let remainSeconds = (new Date(finishTime) - new Date()) / 1000
  if (remainSeconds <= 0) return t('roadmap.expired')
  const days = Math.floor(remainSeconds / 86400)
  remainSeconds -= days * 86400
  const hours = Math.floor(remainSeconds / 3600)
  remainSeconds -= hours * 3600
  const minutes = Math.floor(remainSeconds / 60)
  return `${days > 0 ? `${days} ${t('roadmap.days')}` : ''} ${
    hours > 0 ? `${hours} ${t('roadmap.hours')}` : ''
  } ${minutes > 0 ? `${minutes} ${t('roadmap.minutes')}` : t('roadmap.expired')}`
}

const duration = (startDate, finishDate) => {
  return Math.ceil((new Date(finishDate) - new Date(startDate)) / 1000 / 86400)
}

export { remainingTime, duration }
