import * as React from 'react'
import {
  Breadcrumbs,
  Box,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
  Chip,
  ListItemIcon,
  Badge
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone'
import { useTranslation } from 'react-i18next'

import { getData } from '../utils/localStorage'
import logo from '../assets/images/book512.png'
import { useAuth, useBreadcrumb } from '../contexts'
import vars from '../config/vars'
import Notification from './Notification'

const pages = [
  { to: '/', name: 'pages.home.menu' },
  { to: '/my-lps', name: 'pages.myLps.menu' },
  { to: '/discovery', name: 'pages.discovery.menu' },
  { to: '/organizations', name: 'pages.organization.menu' }
]

const Header = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElNotif, setAnchorElNotif] = React.useState(null)
  const [newNotif, setNewNotif] = React.useState(0)
  const { breadcrumbs } = useBreadcrumb()
  const auth = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('common')

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogut = () => {
    auth.signout(() => navigate('/login', { replace: true }))
  }

  const addNewNotif = () => {
    setNewNotif(newNotif + 1)
  }

  const openNotifMenu = (e) => {
    setAnchorElNotif(e.currentTarget)
    setNewNotif(0)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Breadcrumbs>
          {breadcrumbs.map((br, index) => (
            <Link key={index} style={{ textDecoration: 'none', color: 'lightslategray' }} to={br.link}>
              {br.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>
      <Box sx={{ mr: 2 }}>
        <IconButton onClick={openNotifMenu} sx={{ color: '#6c68f3' }}>
          <Badge badgeContent={newNotif} variant='dot' color="info">
            <NotificationsActiveTwoToneIcon />
          </Badge>
        </IconButton>
        <Notification
          anchorEl={anchorElNotif}
          setNewNotif={setNewNotif}
          addNewNotif={addNewNotif}
          handleClose={() => setAnchorElNotif(null)}
        />
      </Box>
      <Box sx={{ mr: 1 }}>
        <Chip label={auth.user.name} />
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              sx={{ border: '2px solid white' }}
              alt="Avatar"
              src={`${vars.server}/resources/avatars/${auth.user.userId}/64x64${auth.user.avatar}`}
            />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
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
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}>
          <MenuItem key={'profile'} onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Avatar
                sx={{ border: '2px solid white' }}
                alt="Avatar"
                src={`${vars.server}/resources/avatars/${auth.user.userId}/64x64${auth.user.avatar}`}
              />
            </ListItemIcon>
            <Link
              style={{ textDecoration: 'none', color: 'inherit' }}
              to={`/profile/${auth.user.userId}`}>
              <Typography textAlign="center">{t('pages.profile.menu')}</Typography>
            </Link>
          </MenuItem>
          <MenuItem key={'setting'} onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/settings">
              <Typography textAlign="center">{t('pages.settings.menu')}</Typography>
            </Link>
          </MenuItem>
          <MenuItem key={'logout'} onClick={handleLogut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">{t('auth.logout')}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}

export default Header
