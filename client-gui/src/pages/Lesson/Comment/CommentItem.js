import * as React from 'react'
import { Box, Avatar, IconButton, TextField } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'

import { commentApi } from '../../../apis'
import { useSnackbar, useAuth } from '../../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../../constants'
import { getData } from '../../../utils/localStorage'
import vars from '../../../config/vars'

const CommentItem = (props) => {
  const [openReply, setOpenReply] = React.useState(false)
  const [replyValue, setReplyValue] = React.useState('')
  const { _id, content, createdAt, userId } = props.data
  const [childs, setChilds] = React.useState(props.data.childs || [])
  const { lesson: lessonId } = useParams()
  const { openSnackbar } = useSnackbar()
  const auth = useAuth()

  const submitReply = async () => {
    if (replyValue === '') return
    try {
      const { status, data } = await commentApi.createComment(lessonId, _id, replyValue)
      console.log(data)
      if (status === HTTP_STATUS.OK) {
        setChilds([
          ...childs,
          {
            ...data,
            userId: {
              name: getData('user').name,
              avatar: `${vars.server}/resources/avatars/${auth.user.userId}/64x64${auth.user.avatar}`
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

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Avatar
        alt={userId.name}
        src={`${vars.server}/resources/avatars/${userId._id}/64x64${userId.avatar || ''}`}
        sx={{ border: '2px solid #6c68f3' }}
      />
      <Box sx={{ ml: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ color: '#6c68f3', fontWeight: 'bold' }}>{userId.name}</Box>
          <IconButton onClick={() => setOpenReply(!openReply)}>
            <ReplyIcon />
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
                sx={{ border: '2px solid #6c68f3' }}
              />
              <Box sx={{ ml: 2 }}>
                <Box sx={{ color: '#6c68f3', fontWeight: 'bold' }}>{child.userId.name}</Box>
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
              placeholder="Start comment"
              sx={{ flexGrow: 1, mt: 1, mb: 1 }}
              multiline
              size="small"
              InputProps={{ sx: { borderRadius: 20 } }}
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
            />
            <IconButton onClick={submitReply} sx={{ m: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}
export default CommentItem
