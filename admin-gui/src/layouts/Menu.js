import * as React from 'react'
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRight'
import { useNavigate, useLocation } from 'react-router-dom'

const menuItem = {
  dashboard: {
    path: '/',
    icon: <DashboardRoundedIcon />,
    name: 'Dashboard'
  },
  user: {
    path: '/users',
    icon: <PersonRoundedIcon />,
    name: 'User'
  },
  learningpath: {
    path: '/learningpaths',
    icon: <RouteRoundedIcon />,
    name: 'Learningpath'
  }
}

const isSelecting = (to, pathname) => {
  if (pathname === '/' && to === '/') return true
  else {
    const x = pathname.slice(1)
    const t = to.slice(1)
    if (t === '') return false
    return x.includes(t)
  }
}

const filename = (props) => {
  const [openSide, setOpenSide] = React.useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: openSide ? '200px' : '60px',
        transition: openSide
          ? (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
              })
          : (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
              }),
        height: 'calc(100vh - 2rem)',
        m: '0.5rem',
        borderRadius: '0.75rem',
        background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))'
      }}>
      <Box sx={{ color: 'white', fontWeight: 500, my: 3, textAlign: 'center' }}>
        {openSide ? 'Learning Path' : 'LP'}
      </Box>
      <Divider
        sx={{
          backgroundColor: 'transparent',
          height: '0.0625rem',
          border: '0px solid rgba(0, 0, 0, 0.08)',
          borderBottom: 'none',
          opacity: 0.25,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0)) !important'
        }}
      />
      <Box
        sx={{
          mt: 3,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          flexGrow: 1
        }}>
        <List sx={{ flexGrow: 1 }}>
          {Object.entries(menuItem).map(([name, item], index) => {
            const selected = isSelecting(item.path, pathname)
            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  border: 'none',
                  borderRadius: 1,
                  width: openSide ? '180px' : '40px',
                  justifyContent: openSide ? 'initial' : 'center',
                  my: 1,
                  mx: '10px',
                  textTransform: 'none',
                  transition: openSide
                    ? (theme) =>
                        theme.transitions.create(['all'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen
                        })
                    : (theme) =>
                        theme.transitions.create(['all'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.leavingScreen
                        }),
                  background: selected
                    ? 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))'
                    : 'none',
                  '&:hover': {
                    background: !selected
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))'
                  }
                }}>
                <ListItemIcon sx={{ justifyContent: 'center', color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                {openSide && (
                  <ListItemText
                    primary={<Typography sx={{ fontSize: 14 }}>{item.name}</Typography>}
                    sx={{ opacity: openSide ? 1 : 0 }}
                  />
                )}
              </ListItemButton>
            )
          })}
        </List>
        <List>
          <ListItemButton
            onClick={() => setOpenSide(!openSide)}
            sx={{
              color: 'white',
              border: 'none',
              borderRadius: 1,
              width: openSide ? '180px' : '40px',
              justifyContent: openSide ? 'initial' : 'center',
              transition: openSide
                ? (theme) =>
                    theme.transitions.create(['all'], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen
                    })
                : (theme) =>
                    theme.transitions.create(['all'], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.leavingScreen
                    }),
              my: 1,
              mx: '10px',
              textTransform: 'none',
              background: 'none',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}>
            <ListItemIcon sx={{ justifyContent: 'center', color: 'inherit' }}>
              {openSide ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
            </ListItemIcon>
            {openSide && (
              <ListItemText
                primary={<Typography sx={{ fontSize: 14 }}>Close</Typography>}
                sx={{ opacity: openSide ? 1 : 0 }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}
export default filename
