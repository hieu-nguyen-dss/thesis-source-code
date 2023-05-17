import * as React from 'react'
import { Box, TextField, IconButton, Menu, ListItemIcon, MenuItem } from '@mui/material'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import { Logout } from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'

const Header = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, my: 2 }}>
      <Box sx={{ fontWeight: 500 }}></Box>
      <Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} >
          <AccountCircleRoundedIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
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
      >
        <MenuItem onClick={logout} >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
export default Header
