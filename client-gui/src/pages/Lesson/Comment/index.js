import * as React from 'react'
import { Drawer, Toolbar, Button, IconButton, Box, Avatar, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ReplayIcon from '@mui/icons-material/Replay'
import SendIcon from '@mui/icons-material/Send'
import CommentIcon from '@mui/icons-material/Comment'
import { useParams } from 'react-router-dom'

import CommentItem from './CommentItem'
import { commentApi } from '../../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../../constants'
import { useSnackbar, useAuth } from '../../../contexts'
import { getData } from '../../../utils/localStorage'
import vars from '../../../config/vars'

const Comment = ({ commentIds }) => {
  const [cmtIds, setCmtIds] = React.useState(commentIds)
  const [open, setOpen] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  const [cmtValue, setCmtValue] = React.useState('')
  const [fetched, setFetched] = React.useState(false)
  const [comments, setComments] = React.useState(null)
  const { lesson: lessonId } = useParams()
  const { openSnackbar } = useSnackbar()
  const auth = useAuth()
  const cmtsRef = React.useRef()

  const handleOpen = () => {
    setWidth(500)
    setOpen(true)
  }
  const handleClose = () => {
    setWidth(0)
    setOpen(false)
  }

  const submitNewComment = async () => {
    if (cmtValue === '') return
    try {
      const { status, data } = await commentApi.createComment(lessonId, '', cmtValue)
      if (status === HTTP_STATUS.OK) {
        setComments({
          ...(comments || {}),
          [data._id]: {
            ...data,
            userId: {
              _id: auth.user.userId,
              name: getData('user').name,
              avatar: `${auth.user.avatar}`
            }
          }
        })
        setCmtIds([...cmtIds, data._id])
        setCmtValue('')
        cmtsRef.current.scrollIntoView({ behavior: 'smooth' })
      } else {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const groupCommentsByParent = (data) => {
    const rs = data.reduce((res, cur) => {
      if (!cur.parent) {
        return { ...res, [cur._id]: cur }
      } else {
        return {
          ...res,
          [cur.parent._id]: {
            ...(res[cur.parent._id] || {}),
            childs: [...(res[cur.parent._id].childs || []), cur]
          }
        }
      }
    }, {})
    return rs
  }

  const getLessonComments = async (cmtIds) => {
    try {
      const { status, data } = await commentApi.getLessonComments(cmtIds)
      if (status === HTTP_STATUS.OK) {
        setComments(groupCommentsByParent(data))
        setFetched(true)
      } else {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } catch (error) {
      console.log(error)
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const handleKeyUp = async (e) => {
    if (e.key === 'Enter') {
      await submitNewComment()
    }
  }

  React.useEffect(() => {
    if (commentIds.length > 0 && !fetched && open) {
      setCmtIds(commentIds)
      getLessonComments(commentIds)
    }
  }, [commentIds, open])

  return (
    <React.Fragment>
      <Button
        startIcon={<CommentIcon />}
        sx={{
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer - 1,
          bottom: 10,
          right: 3,
          color: '#6c68f3',
          background: 'white',
          border: '2px solid #6c68f3',
          textTransform: 'none',
          '&:hover': {
            background: 'white'
          }
        }}
        onClick={handleOpen}>
        Comments
      </Button>
      <Drawer
        ModalProps={{
          keepMounted: true
        }}
        variant="persistent"
        anchor="right"
        sx={{
          width: width,
          flexShrink: 0,
          transition: 'width 0.2s ease-in-out',
          position: 'relative',
          '& .MuiDrawer-paper': {
            width: 500,
            boxSizing: 'border-box',
            padding: '50px 10px 0px 10px',
            overflowY: 'auto'
          }
        }}
        open={open}>
        <Toolbar />
        <Box textAlign={'center'} sx={{ mt: -2, fontWeight: 'bold' }}>
          Comments
        </Box>
        <IconButton sx={{ position: 'absolute', right: 5, top: 60 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <IconButton
          sx={{ position: 'absolute', right: 40, top: 60 }}
          onClick={() => getLessonComments(cmtIds)}>
          <ReplayIcon />
        </IconButton>
        {comments &&
          Object.entries(comments).map(([id, comment], index) => (
            <CommentItem data={comment} key={index} />
          ))}
        <Box ref={cmtsRef}></Box>
        <Box
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            width: '100%',
            borderTop: '1px grey solid',
            display: 'flex',
            alignItems: 'flex-end',
            background: 'white'
          }}>
          <Avatar
            sx={{ m: 1 }}
            alt="kien"
            src={`${vars.server}/resources/avatars/${auth.user.userId}/64x64${auth.user.avatar}`}
          />
          <TextField
            onKeyUp={handleKeyUp}
            value={cmtValue}
            onChange={(e) => setCmtValue(e.target.value)}
            placeholder="Start comment"
            sx={{ flexGrow: 1, mt: 1, mb: 1 }}
            multiline
            size="small"
            InputProps={{ sx: { borderRadius: 20 } }}
          />
          <IconButton onClick={submitNewComment} sx={{ m: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
export default Comment
