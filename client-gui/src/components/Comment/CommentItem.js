import * as React from 'react'
import { Box, Avatar, IconButton, TextField } from '@mui/material'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { commentApi } from '../../apis'
import { useSnackbar, useAuth } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { getData } from '../../utils/localStorage'
import vars from '../../config/vars'

const CommentItem = (props) => {
  const [openReply, setOpenReply] = React.useState(false)
  const [replyValue, setReplyValue] = React.useState('')
  const { _id, content, createdAt, userId } = props.data
  const [childs, setChilds] = React.useState(props.data.childs || [])
  const { lesson: lessonId, roadmapId, id: courseId } = useParams()
  const { openSnackbar } = useSnackbar()
  const { type } = props
  const auth = useAuth()
  const { t } = useTranslation('common')

  const submitReply = async () => {
    if (replyValue === '') return
    try {
      let submit
      if (type === 'lesson') {
        submit = commentApi.commentLesson(courseId, lessonId, _id, replyValue, props.ownerId)
      }
      if (type === 'course') {
        submit = commentApi.commentCourse(courseId, _id, replyValue, props.ownerId)
      }
      if (type === 'roadmap') {
        submit = commentApi.commentRoadmap(roadmapId, _id, replyValue, props.ownerId)
      }
      const { status, data } = await submit
      console.log(data)
      if (status === HTTP_STATUS.OK) {
        setChilds([
          ...childs,
          {
            ...data,
            userId: {
              _id: auth.user.userId,
              name: getData('user').name,
              avatar: `${auth.user.avatar}`
            }
          }
        ])
        setOpenReply(false)
        setReplyValue('')
      } else {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const handleKeyUp = async (e) => {
    if (e.key === 'Enter') {
      await submitReply()
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Avatar
        alt={userId.name}
        src={`${vars.server}/resources/avatars/${userId._id}/64x64${userId.avatar || ''}`}
        sx={{ border: '2px solid #6c68f3', width: 35, height: 35 }}
      />
      <Box sx={{ ml: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ color: theme => theme.palette.primary.main, fontWeight: 500, fontSize: 14 }}>{userId.name}</Box>
          <IconButton color='primary' size='small' onClick={() => setOpenReply(!openReply)}>
            <ReplyRoundedIcon />
          </IconButton>
        </Box>
        <Box sx={{ color: 'lightgray', fontSize: 12 }}>{new Date(createdAt).toLocaleString()}</Box>
        <Box sx={{ fontSize: 14, mb: 1 }}>{content}</Box>
        {childs.length > 0 &&
          childs.map((child, index) => (
            <Box key={index} sx={{ display: 'flex' }}>
              <Avatar
                alt="K"
                src={`${vars.server}/resources/avatars/${child.userId._id}/64x64${
                  child.userId.avatar || ''
                }`}
                sx={{ border: '2px solid #6c68f3', width: 35, height: 35 }}
              />
              <Box sx={{ ml: 2 }}>
                <Box sx={{ color: theme => theme.palette.primary.main, fontWeight: 500, fontSize: 14 }}>{child.userId.name}</Box>
                <Box sx={{ color: 'lightslategray', fontSize: 12 }}>
                  {new Date(child.createdAt).toLocaleString()}
                </Box>
                <Box sx={{ fontSize: 14, mb: 1 }}>{child.content}</Box>
              </Box>
            </Box>
          ))}
        {openReply && (
          <Box
            style={{
              marginTop: 2,
              width: '100%',
              borderTop: '1px grey solid',
              display: 'flex',
              alignItems: 'flex-end',
              background: 'white'
            }}>
            <Avatar
              sx={{ m: 1, ml: 0 }}
              alt={auth.user.name}
              src={`${vars.server}/resources/avatars/${auth.user.userId}/64x64${auth.user.avatar}`}
            />
            <TextField
              placeholder={t('comment.startComment')}
              sx={{ flexGrow: 1, mt: 1, mb: 1 }}
              multiline
              size="small"
              InputProps={{ sx: { fontSize: 14 } }}
              value={replyValue}
              onKeyUp={handleKeyUp}
              onChange={(e) => setReplyValue(e.target.value)}
            />
            <IconButton color='primary' onClick={submitReply} sx={{ m: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}
export default CommentItem
