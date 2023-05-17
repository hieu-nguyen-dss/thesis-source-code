import * as React from 'react'
import { Menu, MenuItem, Typography, ListItemText, Box, Avatar, ListItemIcon } from '@mui/material'

import { notifApi } from '../apis'
import { HTTP_STATUS } from '../constants'
import parseNotif from '../utils/parseNotif'
import { grey } from '@mui/material/colors'

const Notification = (props) => {
  const [loaded, setLoaded] = React.useState(false)
  const [notifs, setNotifs] = React.useState([])
  const getNotifs = async () => {
    // if (loaded) return
    try {
      const { status, data } = await notifApi.getNotifs()
      if (status === HTTP_STATUS.OK) {
        setNotifs(data)
        console.log(data)
      }
      // setLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    if (props.anchorEl) {
      getNotifs()
    }
  }, [props.anchorEl])
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
          width: 400,
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
      {notifs.map((notif, index) => {
        const { primary, secondary, avatarSrc, date } = parseNotif(notif)
        return (
          <MenuItem
            key={index}
            sx={{ '&.MuiMenuItem-root': { whiteSpace: 'normal' }, alignItems: 'flex-start' }}>
            <ListItemIcon >
              <Avatar alt="X" src={avatarSrc} sx={{ width: 56, height: 56, border: '2px solid #6c68f3' }}/>
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontSize: 16, fontWeight: 500 }}>{primary}</Typography>}
              secondary={
                <React.Fragment>
                  <Typography sx={{ fontSize: 14, color: 'grey', mt: 1 }}>{secondary}</Typography>
                  <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.primary.main, mt: 0.5 }}>
                    {date}
                  </Typography>
                </React.Fragment>
              }
            />
          </MenuItem>
        )
      })}
    </Menu>
  )
}
export default Notification
