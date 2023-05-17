import * as React from 'react'
import { Box, Typography } from '@mui/material'
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { useTranslation } from 'react-i18next'

import { useDesigner } from '../../contexts'
import { LESSON_UPDATE_ACTION } from '../../constants'

export default function OppositeContentTimeline() {
  const { t } = useTranslation('common')
  const { histories, columns, tasks } = useDesigner()
  const createContent = (user, subject, actionType, beforeValue = '', afterValue = '') => {
    let content = ''
    if (actionType === LESSON_UPDATE_ACTION.ADD_GROUP_ACTION) {
      content = (
        <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
          <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> {t('lessonUpdate.addGA')}
          <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${columns[subject] ? columns[subject].name : subject}`}</label>
        </Box>
      )
    }
    if (actionType === LESSON_UPDATE_ACTION.REMOVE_GROUP_ACTION) {
      content = (
        <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
          <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> {t('lessonUpdate.delGA')}
          <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${subject}`}</label>
        </Box>
      )
    }
    if (actionType === LESSON_UPDATE_ACTION.ADD_LEARNING_ACTION) {
      content = <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
      <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> {t('lessonUpdate.addLA')}
      <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${tasks[subject] ? tasks[subject].name : subject}`}</label>
    </Box>
    }
    if (actionType === LESSON_UPDATE_ACTION.MOVE_LEARNING_ACTION) {
      content = (
        <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
          <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> move learning action in group action
          <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${columns[subject] ? columns[subject].name : subject}`}</label>
        </Box>
      )
    }
    if (actionType === LESSON_UPDATE_ACTION.RENAME_GROUP_ACTION) {
      content = (
        <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
          <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> {t('lessonUpdate.rename')}
          <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${columns[subject] ? columns[subject].name : subject} `}</label>
          from <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${beforeValue} `}</label>
          to <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${afterValue}`}</label>
        </Box>
      )
    }
    if (actionType === LESSON_UPDATE_ACTION.REMOVE_LEARNING_ACTION) {
      content = (
        <Box sx={{ fontSize: 14, color: 'lightslategray' }} >
          <label style={{ fontSize: 14, fontWeight: 500 }} >{user.name}</label> {t('lessonUpdate.delLA')}
          <label style={{ fontSize: 14, fontWeight: 500 }} >{` ${subject}`}</label>
        </Box>
      )
    }
    return content
  }
  return (
    <Box sx={{ flexGrow: 1, ml: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: '#efefef',
          p: 1,
          borderRadius: 2
        }}>
        <ChangeHistoryIcon />
        <Typography sx={{ fontWeight: '500', textTransform: 'uppercase', ml: 1 }}>
          {t('lessonUpdate.name')}
        </Typography>
      </Box>
      <Timeline position="right" sx={{ maxHeight: 400, overflowY: 'scroll' }}>
        {histories.length > 0 &&
          Object.keys(columns).length > 0 &&
          histories.map((history, index) => {
            let content = createContent(history.user, history.subject, history.actionType)
            if (history.beforeValue && history.afterValue) {
              content = createContent(
                history.user,
                history.subject,
                history.actionType,
                history.beforeValue,
                history.afterValue
              )
            }
            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  sx={{ flex: 0.3, textAlign: 'left', fontSize: 13 }}
                  color="text.secondary">
                  {new Date(history.createdAt).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="success" variant="outlined" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{content}</TimelineContent>
              </TimelineItem>
            )
          })}
      </Timeline>
    </Box>
  )
}
