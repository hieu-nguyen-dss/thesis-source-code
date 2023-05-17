import * as React from 'react'
import {
  Menu,
  MenuItem,
  Typography,
  ListItemText,
  Box,
  Avatar,
  ListItemIcon,
  Button
} from '@mui/material'
import MoreIcon from '@mui/icons-material/MoreHoriz'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSocket, useAuth } from '../contexts'
import { notifApi } from '../apis'
import { HTTP_STATUS } from '../constants'
import parseNotif from '../utils/parseNotif'

const Notification = (props) => {
  const [loaded, setLoaded] = React.useState(false)
  const [notifs, setNotifs] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(1)
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const { socket } = useSocket()
  const auth = useAuth()

  const getNotifs = async () => {
    try {
      const { status, data } = await notifApi.getNotifs(1)
      if (status === HTTP_STATUS.OK) {
        setNotifs(data.result)
        setTotal(data.total)
      }
      setLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  const loadMore = async () => {
    setPage(page + 1)
    try {
      const { status, data } = await notifApi.getNotifs(page + 1)
      if (status === HTTP_STATUS.OK) {
        setNotifs([...notifs, ...data.result])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const joinRoom = () => {
    socket.emit('join-room', { roomId: auth.user.userId })
  }
  const listenNew = () => {
    socket.on('new-notif', (data) => {
      props.addNewNotif()
    })
  }
  const accessNotif = (notif) => {
    if (notif.roadmap) {
      navigate(`/my-lps/roadmaps/${notif.roadmap.id}`)
    }
    if (notif.learningPath) {
      console.log(notif.lesson)
      if (notif.lesson) {
        navigate(`/my-lps/courses/${notif.learningPath.id}/${notif.lesson._id}`)
        return
      }
      navigate(`/my-lps/courses/${notif.learningPath.id}`)
    }
  }
  React.useEffect(() => {
    if (props.anchorEl || !loaded) {
      setPage(1)
      getNotifs()
    }
  }, [props.anchorEl])
  React.useEffect(() => {
    joinRoom()
    listenNew()
  }, [])
  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          width: 450,
          minHeight: 200,
          maxHeight: 600,
          overflowY: 'scroll',
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Box sx={{ textAlign: 'center', p: 2 }}>{t('notif.name')}</Box>
      {notifs.map((notif, index) => {
        const { primary, secondary, avatarSrc, date } = parseNotif(notif, t)
        return (
          <MenuItem
            onClick={() => accessNotif(notif)}
            key={index}
            sx={{ '&.MuiMenuItem-root': { whiteSpace: 'normal' }, alignItems: 'flex-start' }}>
            <ListItemIcon>
              <Avatar
                alt="X"
                src={avatarSrc}
                sx={{ width: 56, height: 56, border: '2px solid #6c68f3' }}
              />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontSize: 16, fontWeight: 500 }}>{primary}</Typography>}
              secondary={
                <React.Fragment>
                  <label stype={{ fontSize: 14, color: 'grey', marginTop: 1 }}>{secondary}</label>
                  <br/>
                  <label sx={{ fontSize: 12, color: 'violet' }}>{date}</label>
                </React.Fragment>
              }
            />
          </MenuItem>
        )
      })}
      {page * 10 < total && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={loadMore}
            startIcon={<MoreIcon />}
            sx={{ textTransform: 'none', color: 'lightslategray' }}
            size="small">
            {t('notif.older')}
          </Button>
        </Box>
      )}
    </Menu>
  )
}
export default Notification
