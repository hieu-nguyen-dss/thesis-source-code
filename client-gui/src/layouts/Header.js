import * as React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
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
import { useAuth } from '../contexts'
import vars from '../config/vars'
import Notification from './Notification'

const pages = [
  { to: '/', name: 'pages.home.menu' },
  { to: '/my-lps', name: 'pages.myLps.menu' },
  { to: '/discovery', name: 'pages.discovery.menu' },
  { to: '/organizations', name: 'pages.organization.menu' }
]

const Header = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElNotif, setAnchorElNotif] = React.useState(null)
  const auth = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('common')
  const { pathname } = useLocation()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogut = () => {
    auth.signout(() => navigate('/login', { replace: true }))
  }

  const isSelecting = (to) => {
    if (pathname === '/' && to === '/') return true
    else {
      const x = pathname.slice(1)
      const t = to.slice(1)
      if (t === '') return false
      return x.includes(t)
    }
  }

  return (
    <React.Fragment>
      <AppBar
        sx={{
          height: 50,
          boxShadow: 'none',
          borderBottom: '0.6px solid #dedede',
          background: 'white',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        color="inherit"
        position="fixed">
        <Container sx={{ minHeight: '50px' }} maxWidth="100vw">
          <Toolbar style={{ minHeight: '50px' }} disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <img src={logo} width={40} height={40} />
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <img src={logo} width={50} height={50} />
            </Box>
            <Box sx={{ flexGrow: 1, m: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}>
                {pages.map((page, index) => (
                  <MenuItem key={index}>
                    <Link to={page.to}>
                      <Typography textAlign="center" sx={{ fontWeight: 600 }}>
                        {t(page.name)}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page, index) => (
                <Button
                  size="small"
                  key={index}
                  sx={{
                    m: 0,
                    mr: 2,
                    ml: 2,
                    borderRadius: 0,
                    height: 48,
                    display: 'block',
                    background: isSelecting(page.to) ? 'rgba(25, 118, 210, 0.04)' : 'white',
                    borderBottom: `3px solid ${isSelecting(page.to) ? '#6c68f3' : 'white'}`
                  }}>
                  <Link to={page.to} style={{ textDecoration: 'none', textTransform: 'uppercase' }}>
                    <Typography
                      textAlign="center"
                      sx={{
                        fontWeight: 500
                      }}>
                      {t(page.name)}
                    </Typography>
                  </Link>
                </Button>
              ))}
            </Box>
            <Box sx={{ mr: 2 }} >
              <IconButton onClick={e => setAnchorElNotif(e.currentTarget)} sx={{ color: '#6c68f3' }} >
                <Badge badgeContent={5} max={99} color='info' >
                  <NotificationsActiveTwoToneIcon />
                </Badge>
              </IconButton>
              <Notification anchorEl={anchorElNotif} handleClose={() => setAnchorElNotif(null)} />
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
                // sx={{ mt: '45px' }}
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
                  <ListItemIcon><Settings fontSize='small' /></ListItemIcon>
                  <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/settings">
                    <Typography textAlign="center">{t('pages.settings.menu')}</Typography>
                  </Link>
                </MenuItem>
                <MenuItem key={'logout'} onClick={handleLogut}>
                  <ListItemIcon><Logout fontSize='small' /></ListItemIcon>
                  <Typography textAlign="center">{t('auth.logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* <Outlet /> */}
    </React.Fragment>
  )
}

export default Header
