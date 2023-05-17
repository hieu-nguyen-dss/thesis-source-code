import { Typography, Box } from '@mui/material'
import roadmap from '../apis/roadmap'
import vars from '../config/vars'
import { NOTIF } from '../constants'

const parseNotif = (data, t) => {
  const primary = t(`notif.${data.notifType}`)
  let secondary = (
    <>
      <label style={{ fontWeight: 500, marginRight: 4 }}>{data.sender.name}</label>
      <label style={{ marginRight: 4 }}>{t(`notif.${data.notifType}`)}</label>
      <label style={{ fontWeight: 500, marginRight: 4 }}>
        {data.roadmap ? data.roadmap.name : ''}
      </label>
      <label style={{ fontWeight: 500, marginRight: 4 }}>
        {data.learningPath ? data.learningPath.name : ''}
      </label>
    </>
  )
  if (data.notifType === NOTIF.ADD_RM_CL || data.notifType === NOTIF.DONE_RM_CL) {
    secondary = (
      <>
        <label style={{ fontWeight: 500, marginRight: 4 }}>{data.sender.name}</label>
        <label style={{ marginRight: 4 }}>{data.notifType}</label>
        <label style={{ fontWeight: 500, marginRight: 4 }}>{data.content.itemName}</label>
        <label style={{ marginRight: 4 }}>{t('notif.forStep')}</label>
        <label style={{ marginRight: 4, fontWeight: 500 }}> {data.content.stepName}</label>
        <label style={{ marginRight: 4 }}>{t('notif.ofRoadmap')}</label>
        <label style={{ fontWeight: 500 }}> {data.roadmap.name}</label>
      </>
    )
  }
  if (data.notifType === NOTIF.CMT_LS) {
    secondary = (
      <>
        <label style={{ fontWeight: 500, marginRight: 4 }}>{data.sender.name}</label>
        <label style={{ marginRight: 4 }}>{data.notifType}</label>
        <label style={{ marginRight: 4, fontWeight: 500 }}>{data.lesson.name}</label>
        {t('notif.ofCourse')}
        <label style={{ fontWeight: 500, marginRight: 4 }}>
          {data.roadmap ? data.roadmap.name : ''}
        </label>
        <label style={{ fontWeight: 500, marginRight: 4 }}>
          {data.learningPath ? data.learningPath.name : ''}
        </label>
      </>
    )
  }
  const date = new Date(data.createdAt).toLocaleString()
  const avatarSrc = `${vars.server}/resources/avatars/${data.sender._id}/64x64${data.sender.avatar}`
  return {
    sender: data.sender,
    primary,
    secondary,
    date,
    avatarSrc
  }
}

export default parseNotif
